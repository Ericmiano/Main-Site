/**
 * AAK Site Connector, in the post editor:
 * - "Ready to publish?" in the side panel (and again when Publish is
 *   pressed): the kind of post, chosen with one click; the featured image
 *   and its alt text, set right there; and warnings about anything that
 *   wouldn't come out well on aak.or.ke. The server refuses to publish until
 *   the required items are done (includes/writing.php).
 * - Only YouTube among the embeds, and headings H2 to H4: what aak.or.ke shows.
 * Plain script on WordPress's own editor libraries; no build step.
 */
(function (wp, config) {
  "use strict";
  if (!wp || !config) return;

  var el = wp.element.createElement;
  var useState = wp.element.useState;
  var useSelect = wp.data.useSelect;
  var useDispatch = wp.data.useDispatch;
  var C = wp.components;
  var editorUi = wp.editor && wp.editor.PluginDocumentSettingPanel ? wp.editor : wp.editPost;
  var MediaUpload = wp.blockEditor && wp.blockEditor.MediaUpload;
  var MediaUploadCheck = wp.blockEditor && wp.blockEditor.MediaUploadCheck;
  var LONG_TITLE = 90;

  // Headings: H2 to H4 (the article's title is the H1; aak.or.ke turns
  // others into these anyway).
  wp.hooks.addFilter("blocks.registerBlockType", "aak/heading-levels", function (settings, name) {
    if (name !== "core/heading") return settings;
    var attributes = Object.assign({}, settings.attributes);
    attributes.levelOptions = Object.assign({ type: "array" }, attributes.levelOptions, {
      default: [2, 3, 4],
    });
    return Object.assign({}, settings, { attributes: attributes });
  });

  wp.domReady(function () {
    // Embeds: YouTube only. Other embeds don't appear on aak.or.ke.
    (wp.blocks.getBlockVariations("core/embed") || []).forEach(function (variation) {
      if (variation.name !== "youtube")
        wp.blocks.unregisterBlockVariation("core/embed", variation.name);
    });
    // The kind of post is chosen in "Ready to publish?", one click instead of
    // a list of checkboxes.
    if (config.simple && config.kinds.length) {
      var editor = wp.data.dispatch("core/editor");
      var editPost = wp.data.dispatch("core/edit-post");
      if (editor && editor.removeEditorPanel) editor.removeEditorPanel("taxonomy-panel-category");
      else if (editPost && editPost.removeEditorPanel)
        editPost.removeEditorPanel("taxonomy-panel-category");
    }
  });

  function embedsNotShown(blocks) {
    var out = [];
    (blocks || []).forEach(function (block) {
      if (block.name === "core/embed" && block.attributes.providerNameSlug !== "youtube") {
        out.push(block.attributes.providerNameSlug || "link");
      }
      out = out.concat(embedsNotShown(block.innerBlocks));
    });
    return out;
  }

  function Item(props) {
    var mark = { done: "✓", todo: "✕", warn: "!" }[props.state];
    var colour = { done: "#007017", todo: "#b32d2e", warn: "#996800" }[props.state];
    return el(
      "div",
      { style: { display: "flex", gap: "8px", margin: "0 0 14px" } },
      el(
        "span",
        {
          "aria-hidden": true,
          style: { color: colour, fontWeight: 700, width: "1em", flex: "none" },
        },
        mark,
      ),
      el(
        "div",
        { style: { flex: 1, minWidth: 0 } },
        el("strong", { style: { display: "block" } }, props.title),
        props.children,
      ),
    );
  }

  function AltText(props) {
    var media = props.media;
    var _a = useState("");
    var value = _a[0];
    var setValue = _a[1];
    var _b = useState(false);
    var saving = _b[0];
    var setSaving = _b[1];
    var core = useDispatch("core");
    var notices = useDispatch("core/notices");
    function save() {
      setSaving(true);
      core
        .saveEntityRecord("postType", "attachment", { id: media.id, alt_text: value.trim() })
        .then(function (saved) {
          if (!saved) throw new Error("not saved");
          notices.createSuccessNotice("Alt text saved.", { type: "snackbar" });
        })
        .catch(function () {
          notices.createErrorNotice(
            "The alt text couldn’t be saved: you may not be allowed to change this image. Ask an editor, or upload the image yourself.",
          );
        })
        .finally(function () {
          setSaving(false);
        });
    }
    return el(
      "div",
      null,
      el(C.TextareaControl, {
        label: "Describe the image for people who can’t see it",
        help: "e.g. “Delegates at the AAK Annual Convention in Mombasa”",
        value: value,
        rows: 2,
        onChange: setValue,
        __nextHasNoMarginBottom: true,
      }),
      el(
        C.Button,
        {
          variant: "secondary",
          isBusy: saving,
          disabled: saving || !value.trim(),
          onClick: save,
          style: { marginTop: "6px" },
        },
        "Save alt text",
      ),
    );
  }

  function Checklist() {
    var data = useSelect(function (select) {
      var editor = select("core/editor");
      var featured = editor.getEditedPostAttribute("featured_media");
      return {
        categories: editor.getEditedPostAttribute("categories") || [],
        featured: featured,
        media: featured ? select("core").getEntityRecord("postType", "attachment", featured) : null,
        excerpt: editor.getEditedPostAttribute("excerpt") || "",
        title: editor.getEditedPostAttribute("title") || "",
        blocks: select("core/block-editor").getBlocks(),
      };
    }, []);
    var editPost = useDispatch("core/editor").editPost;

    var kindIds = config.kinds.map(function (k) {
      return k.id;
    });
    var kind = data.categories.filter(function (id) {
      return kindIds.indexOf(id) !== -1;
    })[0];
    var otherCategories = data.categories.filter(function (id) {
      return id !== config.defaultCategory;
    });
    var hasKind = config.kinds.length ? Boolean(kind) : otherCategories.length > 0;
    var alt = data.media ? (data.media.alt_text || "").trim() : "";
    var thumb =
      data.media &&
      ((data.media.media_details &&
        data.media.media_details.sizes &&
        data.media.media_details.sizes.thumbnail &&
        data.media.media_details.sizes.thumbnail.source_url) ||
        data.media.source_url);
    var embeds = embedsNotShown(data.blocks);
    var title = data.title.trim();

    var chooseImage =
      MediaUpload && MediaUploadCheck
        ? el(
            MediaUploadCheck,
            null,
            el(MediaUpload, {
              allowedTypes: ["image"],
              value: data.featured,
              onSelect: function (media) {
                editPost({ featured_media: media.id });
              },
              render: function (open) {
                return el(
                  C.Button,
                  { variant: data.featured ? "link" : "secondary", onClick: open.open },
                  data.featured ? "Change image" : "Choose a featured image",
                );
              },
            }),
          )
        : el("p", null, "Set one under Featured image, below.");

    return el(
      "div",
      null,
      el(
        Item,
        { state: title ? "done" : "todo", title: "Title" },
        title
          ? null
          : el(
              "p",
              { style: { margin: "4px 0 0" } },
              "Give the post a title at the top of the page.",
            ),
      ),
      el(
        Item,
        { state: hasKind ? "done" : "todo", title: "Kind of post" },
        config.kinds.length
          ? el(C.RadioControl, {
              selected: kind || null,
              options: config.kinds.map(function (k) {
                return { label: k.label + " · " + k.hint, value: k.id };
              }),
              onChange: function (id) {
                editPost({ categories: [Number(id)] });
              },
            })
          : el("p", { style: { margin: "4px 0 0" } }, "Tick a category under Categories."),
      ),
      el(
        Item,
        { state: data.featured ? "done" : "todo", title: "Featured image" },
        el(
          "p",
          { style: { margin: "4px 0 6px" } },
          "Shown at the top of the article, on the news page and when the post is shared.",
        ),
        thumb
          ? el("img", {
              src: thumb,
              alt: "",
              style: {
                display: "block",
                width: "96px",
                height: "64px",
                objectFit: "cover",
                borderRadius: "4px",
                marginBottom: "6px",
              },
            })
          : null,
        chooseImage,
      ),
      data.featured
        ? el(
            Item,
            {
              state: !data.media ? "warn" : alt ? "done" : "todo",
              title: "Image description (alt text)",
            },
            !data.media
              ? el("p", { style: { margin: "4px 0 0" } }, "Checking…")
              : alt
                ? el("p", { style: { margin: "4px 0 0", color: "#50575e" } }, "“" + alt + "”")
                : el(AltText, { media: data.media, key: data.media.id }),
          )
        : null,
      el(
        Item,
        { state: data.excerpt.trim() ? "done" : "warn", title: "Summary (optional)" },
        data.excerpt.trim()
          ? null
          : el(
              "p",
              { style: { margin: "4px 0 0" } },
              "Write one under Excerpt: it shows on the news page and when the post is shared. Without one, the opening words are used.",
            ),
      ),
      title.length > LONG_TITLE
        ? el(
            Item,
            { state: "warn", title: "Long title (" + title.length + " characters)" },
            el(
              "p",
              { style: { margin: "4px 0 0" } },
              "It may be cut short in shared links and search results.",
            ),
          )
        : null,
      embeds.length
        ? el(
            Item,
            { state: "warn", title: "Embeds that won’t show" },
            el(
              "p",
              { style: { margin: "4px 0 0" } },
              "Only YouTube videos appear on aak.or.ke. Remove the " +
                embeds.join(", ") +
                " embed, or link to it in the text instead.",
            ),
          )
        : null,
    );
  }

  wp.plugins.registerPlugin("aak-ready", {
    render: function () {
      return el(
        wp.element.Fragment,
        null,
        el(
          editorUi.PluginDocumentSettingPanel,
          { name: "aak-ready", title: "Ready to publish?", initialOpen: true },
          el(Checklist),
        ),
        el(
          editorUi.PluginPrePublishPanel,
          { title: "Before it goes live", initialOpen: true },
          el(Checklist),
        ),
      );
    },
  });
})(window.wp, window.aakEditor);
