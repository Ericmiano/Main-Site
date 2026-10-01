/**
 * Live social feeds. Only Facebook (its page plugin) and YouTube (the
 * channel's uploads playlist) offer always-current embeds without an API
 * account; X, Instagram, LinkedIn and TikTok are linked instead.
 */

/** Facebook page plugin: the page and its latest posts. It lays itself out at
 * the width in its address (180-500px), so pass the space actually available. */
export const facebookFeedUrl = (width: number, height: number) =>
  "https://www.facebook.com/plugins/page.php?href=" +
  encodeURIComponent("https://www.facebook.com/ArchKE/") +
  `&tabs=timeline&width=${Math.max(180, Math.min(500, Math.round(width)))}&height=${height}` +
  "&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false";

/** AAK's YouTube uploads, newest first: channel UC7T3qQvpUIQ7E2CUhd2XYOw, whose
 * uploads playlist is "UU" + the same id. Privacy-enhanced mode. */
export const YOUTUBE_LATEST_EMBED =
  "https://www.youtube-nocookie.com/embed/videoseries?list=UU7T3qQvpUIQ7E2CUhd2XYOw";
