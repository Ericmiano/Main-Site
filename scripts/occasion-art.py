"""Writes the occasion themes' artwork as CSS: garlands (repeating 240 x 48
tiles, one scallop of string each), the banner backgrounds under the header,
and the main bar's colours (see src/data/occasions.ts).

  py scripts/occasion-art.py > occasion-art.css

then replace the block between "Occasion artwork (generated" and "End of
occasion artwork" in src/styles.css with it.
"""
from urllib.parse import quote

W, H = 240, 48


def curve(x):
    t = x / W
    return 5 + 50 * t * (1 - t)


WIRE = "M0 5 Q120 30 240 5"
GREY = "rgba(128,128,128,0.75)"


def svg(w, h, body, style=""):
    s = (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{w}' height='{h}' viewBox='0 0 {w} {h}'>"
        + (f"<style>{style}</style>" if style else "")
        + body
        + "</svg>"
    )
    return 'url("data:image/svg+xml,' + quote(s, safe="/:=,'()!*-.;~ ") + '")'


def wire(colour=GREY, width=1.5):
    return f"<path d='{WIRE}' fill='none' stroke='{colour}' stroke-width='{width}'/>"


def star(cx, cy, r, fill, cls=""):
    c = f" class='{cls}'" if cls else ""
    return (
        f"<path{c} d='M{cx} {cy - r:.1f}L{cx + r * .3:.1f} {cy - r * .3:.1f}L{cx + r:.1f} {cy:.1f}L{cx + r * .3:.1f} {cy + r * .3:.1f}"
        f"L{cx} {cy + r:.1f}L{cx - r * .3:.1f} {cy + r * .3:.1f}L{cx - r:.1f} {cy:.1f}L{cx - r * .3:.1f} {cy - r * .3:.1f}Z' fill='{fill}'/>"
    )


def crescent(cx, cy, r, fill, bg_cut="black"):
    # A crescent: a disc with an offset disc masked out.
    mid = f"m{cx}{cy}".replace(".", "")
    return (
        f"<mask id='{mid}'><rect x='{cx - r - 2}' y='{cy - r - 2}' width='{2 * r + 4}' height='{2 * r + 4}' fill='white'/>"
        f"<circle cx='{cx + r * .45:.1f}' cy='{cy - r * .25:.1f}' r='{r * .85:.1f}' fill='black'/></mask>"
        f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='{fill}' mask='url(%23{mid})'/>"
    ).replace("%23", "#")


TWINKLE = "@keyframes t{50%{opacity:.35}}.b{animation:t 2.4s ease-in-out infinite}"
SWAY = (
    "@keyframes s{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}"
    ".l{transform-box:fill-box;transform-origin:50% 0;animation:s 4s ease-in-out infinite alternate}"
)
STILL = "@media (prefers-reduced-motion:reduce){.b,.l{animation:none}}"

# ---- Garlands --------------------------------------------------------------


def pennants(colours):
    out = [wire()]
    for i, cx in enumerate(range(20, W, 40)):
        y = curve(cx)
        out.append(
            f"<path d='M{cx - 10:.1f} {y:.1f}h20L{cx} {y + 26:.1f}Z' fill='{colours[i % len(colours)]}' stroke='#fff' stroke-width='1.5' stroke-linejoin='round'/>"
        )
    return svg(W, H, "".join(out))


def lights():
    colours = ["#ff5a4e", "#ffd25e", "#5fd068", "#fff7e0", "#ff5a4e", "#ffd25e"]
    out = [wire()]
    for i, cx in enumerate(range(20, W, 40)):
        y = curve(cx) + 8
        c = colours[i]
        out.append(
            f"<g class='b' style='animation-delay:{i * 0.4:.1f}s'>"
            f"<circle cx='{cx}' cy='{y:.1f}' r='11' fill='{c}' opacity='.3'/>"
            f"<rect x='{cx - 2.5}' y='{y - 9:.1f}' width='5' height='4' fill='#3a3a3a'/>"
            f"<ellipse cx='{cx}' cy='{y:.1f}' rx='5' ry='7' fill='{c}'/></g>"
        )
    return svg(W, H, "".join(out), TWINKLE + STILL)


def lanterns():
    gold, light, deep = "#c9a227", "#f2c94c", "#c27c0e"
    out = [wire(gold)]
    for i, (cx, drop) in enumerate([(40, 2), (120, 8), (200, 2)]):
        y = curve(cx)
        top = y + drop
        out.append(
            f"<g class='l' style='animation-delay:{-i * 1.3:.1f}s'>"
            f"<path d='M{cx} {y:.1f}V{top + 3:.1f}' stroke='{gold}' stroke-width='1'/>"
            f"<path d='M{cx - 6} {top + 5:.1f}h12l-1.5-2h-9Z' fill='{gold}'/>"
            f"<path d='M{cx - 7} {top + 7:.1f}c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v14c0 3.9-3.1 7-7 7s-7-3.1-7-7Z' fill='{light}'/>"
            f"<path d='M{cx - 2.5} {top + 8:.1f}v17M{cx + 2.5} {top + 8:.1f}v17' stroke='{deep}' stroke-width='1'/>"
            f"<path d='M{cx - 2} {top + 28:.1f}h4l-2 6Z' fill='{gold}'/></g>"
        )
    for i, cx in enumerate([80, 160]):
        out.append(star(cx, curve(cx) + 10, 5, light, "b"))
    return svg(W, H, "".join(out), TWINKLE + SWAY + STILL)


def crescents():
    gold = "#f2c94c"
    out = [wire("#c9a227")]
    for i, cx in enumerate(range(20, W, 40)):
        y = curve(cx)
        if i % 2 == 0:
            out.append(f"<path d='M{cx} {y:.1f}v6' stroke='#c9a227' stroke-width='1'/>")
            out.append(crescent(cx, y + 15, 9, gold))
        else:
            out.append(f"<path d='M{cx} {y:.1f}v4' stroke='#c9a227' stroke-width='1'/>")
            out.append(star(cx, y + 11, 6.5, gold, "b"))
    return svg(W, H, "".join(out), TWINKLE + STILL)


def leaves():
    greens = ["#43a047", "#7cb342", "#2e7d32"]
    out = [wire("#2e7d32", 2.5)]
    for i, cx in enumerate(range(15, W, 30)):
        y = curve(cx)
        ang = -50 if i % 2 else 130
        out.append(
            f"<path transform='translate({cx} {y:.1f}) rotate({ang}) scale(.85)' d='M0 0C0-9 5-16 16-18c-1 10-7 16-16 18Z' fill='{greens[i % 3]}'/>"
        )
    return svg(W, H, "".join(out))


def flowers():
    petals = ["#f8bbd0", "#fff59d", "#d1c4e9", "#ffccbc", "#c5e1a5", "#b3e5fc"]
    out = [wire("#7cb342", 2)]
    for i, cx in enumerate(range(20, W, 40)):
        y = curve(cx) + 10
        p = petals[i]
        for k in range(5):
            import math

            a = k * 2 * math.pi / 5
            out.append(f"<circle cx='{cx + 5.5 * math.cos(a):.1f}' cy='{y + 5.5 * math.sin(a):.1f}' r='4.5' fill='{p}' stroke='rgba(0,0,0,.08)'/>")
        out.append(f"<circle cx='{cx}' cy='{y:.1f}' r='3' fill='#f9a825'/>")
        out.append(f"<path transform='translate({cx + 10} {curve(cx + 10):.1f}) rotate(120) scale(.5)' d='M0 0C0-9 5-16 16-18c-1 10-7 16-16 18Z' fill='#7cb342'/>")
    return svg(W, H, "".join(out))


def tools():
    # Hazard tape with hard hats and hammers hanging from it.
    tape = (
        "<defs><pattern id='h' width='12' height='12' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'>"
        "<rect width='6' height='12' fill='#f6c400'/><rect x='6' width='6' height='12' fill='#1a1a1a'/></pattern></defs>"
    )
    out = [tape, "<path d='M0 5 Q120 30 240 5' fill='none' stroke='url(#h)' stroke-width='5'/>"]
    for i, cx in enumerate(range(30, W, 60)):
        y = curve(cx) + 2
        if i % 2 == 0:
            # Hard hat
            out.append(
                f"<path d='M{cx} {y:.1f}v3' stroke='#555' stroke-width='1'/>"
                f"<path d='M{cx - 11} {y + 16:.1f}a11 11 0 0 1 22 0Z' fill='#f6c400' stroke='#b38f00' stroke-width='1'/>"
                f"<rect x='{cx - 14}' y='{y + 15:.1f}' width='28' height='3.5' rx='1.5' fill='#e0b000'/>"
                f"<rect x='{cx - 1.5}' y='{y + 5:.1f}' width='3' height='10' fill='#e0b000'/>"
            )
        else:
            # Hammer
            out.append(
                f"<path d='M{cx} {y:.1f}v3' stroke='#555' stroke-width='1'/>"
                f"<g transform='rotate(-25 {cx} {y + 12:.1f})'><rect x='{cx - 1.8}' y='{y + 8:.1f}' width='3.6' height='20' rx='1' fill='#8d6e63'/>"
                f"<rect x='{cx - 9}' y='{y + 3:.1f}' width='18' height='7' rx='1.5' fill='#607d8b'/></g>"
            )
    return svg(W, H, "".join(out))


GARLANDS = {
    "flag": pennants(["#000000", "#bb0000", "#006600"]),
    "confetti": pennants(["#b71727", "#f2c94c", "#1f8a8a", "#151515", "#ffffff"]),
    "lights": lights(),
    "lanterns": lanterns(),
    "crescents": crescents(),
    "leaves": leaves(),
    "flowers": flowers(),
    "tools": tools(),
}

# ---- Banner backgrounds ------------------------------------------------------


def fireworks(colours, size=220, alpha=0.55):
    import math

    out = []
    for n, (x, y, r, c) in enumerate([(40, 40, 26, colours[0]), (150, 30, 20, colours[1]), (110, 110, 30, colours[2]), (200, 150, 18, colours[0]), (30, 160, 16, colours[1])]):
        for k in range(12):
            a = k * math.pi / 6
            x1, y1 = x + r * 0.35 * math.cos(a), y + r * 0.35 * math.sin(a)
            x2, y2 = x + r * math.cos(a), y + r * math.sin(a)
            out.append(f"<path d='M{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}' stroke='{c}' stroke-width='2' stroke-linecap='round'/>")
            out.append(f"<circle cx='{x2:.1f}' cy='{y2:.1f}' r='1.6' fill='{c}'/>")
    return svg(size, size, f"<g opacity='{alpha}'>{''.join(out)}</g>")


def stars_tile(colour, size=160, alpha=0.5):
    pts = [(20, 30, 5), (90, 20, 3.5), (140, 60, 6), (60, 90, 4), (120, 130, 5), (25, 140, 3), (100, 75, 2.5)]
    return svg(size, size, f"<g opacity='{alpha}'>" + "".join(star(x, y, r, colour) for x, y, r in pts) + "</g>")


def night_tile():
    body = crescent(60, 50, 14, "#f2c94c") + "".join(
        star(x, y, r, "#f2c94c") for x, y, r in [(130, 30, 4), (160, 90, 3), (30, 120, 3.5), (100, 140, 5)]
    )
    return svg(180, 180, f"<g opacity='.45'>{body}</g>")


def geometric_tile(colour):
    # An eight-point star lattice, as in Islamic geometric patterns.
    s = 56
    c = s / 2
    r1, r2 = 20, 9
    import math

    pts = []
    for k in range(16):
        a = k * math.pi / 8
        r = r1 if k % 2 == 0 else r2
        pts.append(f"{c + r * math.cos(a):.1f},{c + r * math.sin(a):.1f}")
    body = f"<polygon points='{' '.join(pts)}' fill='none' stroke='{colour}' stroke-width='1.2'/>"
    body += f"<path d='M0 0L{c - r2} {c - r2}M{s} 0L{c + r2} {c - r2}M0 {s}L{c - r2} {c + r2}M{s} {s}L{c + r2} {c + r2}' stroke='{colour}' stroke-width='1.2'/>"
    return svg(s, s, f"<g opacity='.35'>{body}</g>")


def flower_tile():
    import math

    out = []
    for x, y, p in [(30, 30, "#f8bbd0"), (110, 60, "#fff59d"), (60, 110, "#d1c4e9"), (140, 140, "#ffccbc")]:
        for k in range(5):
            a = k * 2 * math.pi / 5
            out.append(f"<circle cx='{x + 7 * math.cos(a):.1f}' cy='{y + 7 * math.sin(a):.1f}' r='6' fill='{p}'/>")
        out.append(f"<circle cx='{x}' cy='{y}' r='4' fill='#f9a825'/>")
    return svg(170, 170, f"<g opacity='.35'>{''.join(out)}</g>")


def leaf_tile(colour="#a5d6a7"):
    out = []
    for x, y, a in [(30, 30, 20), (110, 50, -40), (60, 110, 70), (140, 130, 160)]:
        out.append(f"<path transform='translate({x} {y}) rotate({a}) scale(1.4)' d='M0 0C0-9 5-16 16-18c-1 10-7 16-16 18Z' fill='{colour}'/>")
    return svg(170, 170, f"<g opacity='.3'>{''.join(out)}</g>")


HAZARD = "repeating-linear-gradient(-45deg, #f6c400 0 14px, #1a1a1a 14px 28px)"

BANNERS = {
    "jamhuri-day": f"{fireworks(['#ff4d4d', '#3ccf6e', '#ffffff'])}, linear-gradient(90deg, #0d0d0d, #1c1c1c 50%, #0d0d0d)",
    "madaraka-day": "radial-gradient(ellipse 60% 140% at 50% 130%, rgb(255 196 92 / 0.65), transparent 70%), "
    "repeating-conic-gradient(from 270deg at 50% 130%, rgb(255 210 120 / 0.16) 0 5deg, transparent 5deg 10deg), "
    "linear-gradient(#3a0d0d, #1a0606)",
    "mashujaa-day": f"{stars_tile('#f2c94c', 150, 0.55)}, linear-gradient(90deg, #0d0d0d, #2a0a0a 50%, #0d0d0d)",
    "christmas": f"{stars_tile('#f2c94c', 170, 0.45)}, linear-gradient(90deg, #0b3d22, #145c33 50%, #0b3d22)",
    "new-year": f"{fireworks(['#f2c94c', '#ffffff', '#ffd25e'])}, linear-gradient(90deg, #080808, #1e1a10 50%, #080808)",
    "ramadan": f"{night_tile()}, linear-gradient(90deg, #071f2b, #0c3346 50%, #071f2b)",
    "eid-al-fitr": f"{geometric_tile('#f2c94c')}, linear-gradient(90deg, #0a3d26, #0f5a37 50%, #0a3d26)",
    "eid-al-adha": f"{geometric_tile('#f2c94c')}, linear-gradient(90deg, #08404a, #0e5e6c 50%, #08404a)",
    "easter": f"{flower_tile()}, linear-gradient(90deg, #3e2163, #5b3290 50%, #3e2163)",
    "labour-day": f"{HAZARD} top / 100% 10px no-repeat, {HAZARD} bottom / 100% 10px no-repeat, linear-gradient(90deg, #1e1e1e, #2e2e2e 50%, #1e1e1e)",
    "mazingira-day": f"{leaf_tile()}, linear-gradient(90deg, #0e3d18, #1b5e20 50%, #0e3d18)",
}

# The main bar: national days and Christmas keep AAK red (with a pattern);
# the rest take the occasion's colour.
BARS = {
    "jamhuri-day": f"{fireworks(['#ffffff', '#ffffff', '#ffffff'], 260, 0.16)}, var(--primary)",
    "madaraka-day": "repeating-conic-gradient(from 270deg at 50% 160%, rgb(255 255 255 / 0.07) 0 5deg, transparent 5deg 10deg), var(--primary)",
    "mashujaa-day": f"{stars_tile('#ffffff', 150, 0.22)}, var(--primary)",
    "christmas": f"{stars_tile('#ffe08a', 170, 0.35)}, var(--primary)",
    "new-year": f"{stars_tile('#f2c94c', 150, 0.45)}, #121212",
    "ramadan": f"{night_tile()}, #0b2a3a",
    "eid-al-fitr": f"{geometric_tile('#f2c94c')}, #0f5132",
    "eid-al-adha": f"{geometric_tile('#f2c94c')}, #0e4f5c",
    "easter": f"{flower_tile()}, #4c2a73",
    "labour-day": f"{HAZARD} bottom / 100% 6px no-repeat, #262626",
    "mazingira-day": f"{leaf_tile('#c8e6c9')}, #1b5e20",
}

print("/* Occasion artwork (generated by scripts/occasion-art.py: garlands, banners, main bar). */")
print(".occasion-garland {\n  background-repeat: repeat-x;\n  background-size: 240px 48px;\n}")
for name, url in GARLANDS.items():
    print(f".occasion-garland-{name} {{\n  background-image: {url};\n}}")
for oid, bg in BANNERS.items():
    print(f".occasion-banner-{oid} {{\n  background: {bg};\n}}")
for oid, bg in BARS.items():
    print(f'html[data-occasion="{oid}"] .site-main-bar {{\n  background: {bg};\n}}')
print("/* End of occasion artwork. */")
