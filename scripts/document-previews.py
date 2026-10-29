"""
Cover previews for the document archives: the first page of every PDF listed
in src/data/report-archives.ts, rendered 320px wide to
public/img/publications/previews/, and the list the site reads,
src/data/document-previews.ts. The archive pages show a preview beside the
pointer as a title is hovered (components/site/ReportArchive.tsx).

The PDFs are read from documents/ (the originals kept beside the repo's
R2 uploads). Run after adding documents to an archive:

    py scripts/document-previews.py

Needs PyMuPDF and Pillow (pip install pymupdf pillow). Previews already made
are kept; delete one to render it again.
"""

import hashlib
import io
import json
import re
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ARCHIVES = ROOT / "src/data/report-archives.ts"
DOCS = ROOT / "documents"
OUT = ROOT / "public/img/publications/previews"
LIST = ROOT / "src/data/document-previews.ts"
WIDTH = 320  # shown at up to 160px wide: sharp on 2x screens


MAX_NAME = 48  # file names short enough for deep folders on Windows (260-character paths)


def slug(name: str) -> str:
    full = re.sub(r"[^a-z0-9]+", "-", Path(name).stem.lower()).strip("-")
    if len(full) <= MAX_NAME:
        return full
    # Shortened, with a few characters of the full name's hash so two long
    # names that start alike stay apart.
    tag = hashlib.sha1(full.encode()).hexdigest()[:6]
    return f"{full[: MAX_NAME - 7].rstrip('-')}-{tag}"


def main() -> None:
    source = ARCHIVES.read_text(encoding="utf-8")
    files = sorted(set(re.findall(r'fileUrl\(\s*"/documents/([^"]+\.pdf)",?\s*\)', source)))
    OUT.mkdir(parents=True, exist_ok=True)
    previews = {}
    for name in files:
        pdf = DOCS / name
        if not pdf.exists():
            print(f"skipped (not in documents/): {name}")
            continue
        out = OUT / f"{slug(name)}.webp"
        if not out.exists():
            doc = pymupdf.open(pdf)
            if doc.page_count == 0:
                print(f"skipped (no pages can be read): {name}")
                continue
            page = doc[0]
            zoom = WIDTH * 2 / page.rect.width  # render at twice the size, then downsample
            pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
            img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
            img = img.resize((WIDTH, round(img.height * WIDTH / img.width)), Image.LANCZOS)
            img.save(out, "WEBP", quality=84, method=6)
        with Image.open(out) as img:
            previews[name] = {
                "src": f"/img/publications/previews/{out.name}",
                "width": img.width,
                "height": img.height,
            }
    body = json.dumps(previews, indent=2)
    LIST.write_text(
        "// Made by scripts/document-previews.py: run it again after adding documents.\n"
        "/** Each archive PDF's first page, by file name, for the hover preview. */\n"
        "export const documentPreviews: Record<string, { src: string; width: number; height: number }> =\n"
        f"  {body.replace(chr(10), chr(10) + '  ')};\n",
        encoding="utf-8",
    )
    print(f"{len(previews)} previews; list written to {LIST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
