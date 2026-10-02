"""
Certificate records for an AAK event, and the register the website checks them against.

    python scripts/certificates/make-register.py \
        --attendees "attendees.xlsx" --out "C:/.../Certificates/convention-2026" \
        --prefix CV26 --event "AAK Annual Convention 2026" \
        --dates "16 - 19 September 2026" \
        --venue "Diamonds Leisure Beach & Golf Resort, Diani"

The attendee sheet needs a name column (full_name, or set --name-column);
email and organization are used when present. With --serial-column, only rows
that have a serial number get a certificate, and the serial is carried into
the register: the website verifies a certificate by its serial plus the
holder's surname. Each recipient also gets a private code (AAK-<prefix>-XXXX-
XXXX) as their unique identifier in AAK's records; it isn't shown publicly. Writes, into --out (keep it OUTSIDE this repository, which is
public):

  master.csv        Private. Every code issued, with email and organisation,
                    so re-running keeps everyone's code. Never upload it.
  register.csv      Upload to /home/<account>/aak-certificates/<event>.csv on
                    the cPanel server (outside public_html). Code, name and
                    certificate details only: no contact details.
  mail-merge.csv    Private. For producing and sending the certificates: name,
                    serial, email and private code per recipient.
  qr/<code>.png     Only with --qr: a QR code per certificate (kept for later
                    use; the website currently verifies by serial and surname).

Re-run with an updated attendee sheet to add late attendees: existing codes
never change (people are matched by serial, then email, then name). To withdraw a certificate, set its status to "revoked" in
master.csv and re-run (or edit register.csv on the server directly).

Needs: pip install openpyxl (and segno, for --qr)
"""

import argparse
import csv
import datetime
import re
import secrets
import sys
from pathlib import Path

import openpyxl

SITE = "https://aak.or.ke"
# No 0/O, 1/I/L or U, so codes can't be misread or mistyped.
ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ"
MASTER_FIELDS = ["code", "serial", "name", "name_as_supplied", "email", "organization", "status"]
REGISTER_FIELDS = ["code", "serial", "name", "certificate", "event", "dates", "venue", "cpd_points", "issued", "status"]
KEEP_UPPER = {"QS", "II", "III", "IV", "MBS", "OGW", "HSC", "EBS", "CBS"}
TITLES = {"arch": "Arch.", "qs": "QS", "eng": "Eng.", "dr": "Dr.", "prof": "Prof.", "plan": "Plan."}


def new_code(prefix: str, taken: set[str]) -> str:
    while True:
        body = "".join(secrets.choice(ALPHABET) for _ in range(8))
        code = f"AAK-{prefix}-{body[:4]}-{body[4:]}"
        if code not in taken:
            return code


def tidy_name(raw: str) -> str:
    """Collapse spaces; title-case names typed all in capitals or all in lower case."""
    name = re.sub(r"\s+", " ", raw).strip()
    if not (name.isupper() or name.islower()):
        return name
    words = []
    for word in name.split(" "):
        bare = word.rstrip(".").lower()
        if bare in TITLES:
            words.append(TITLES[bare])
        elif word.strip(",").upper() in KEEP_UPPER:
            words.append(word.upper())
        elif word.strip(",").upper() == "PHD":
            words.append(word.upper().replace("PHD", "PhD"))
        else:
            # Capitalise the first letter and any after "-", "." or "(" (Wa-Mathai,
            # M.Arch., (Dr)); letters after an apostrophe stay lower case, as in
            # Ndung'u and Mong'are.
            words.append(re.sub(r"(^|[-.(])([a-z])", lambda m: m.group(1) + m.group(2).upper(), word.lower()))
    return " ".join(words)


def read_attendees(path: Path, name_col: str, serial_col: str | None) -> list[dict]:
    sheet = openpyxl.load_workbook(path, read_only=True, data_only=True).worksheets[0]
    rows = sheet.iter_rows(values_only=True)
    header = [str(h or "").strip().lower() for h in next(rows)]
    for col in [name_col, serial_col]:
        if col and col.lower() not in header:
            sys.exit(f"The attendee sheet has no '{col}' column.")
    people = []
    for row in rows:
        record = {h: ("" if v is None else str(v).strip()) for h, v in zip(header, row)}
        record["full_name"] = record.get(name_col.lower(), "")
        record["serial"] = record.get(serial_col.lower(), "") if serial_col else ""
        if record["full_name"] and (record["serial"] or not serial_col):
            people.append(record)
    return people


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--attendees", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--prefix", required=True, help="Short event code inside each certificate code, e.g. CV26")
    ap.add_argument("--event", required=True)
    ap.add_argument("--dates", required=True)
    ap.add_argument("--venue", default="")
    ap.add_argument("--certificate", default="Certificate of Attendance")
    ap.add_argument("--cpd-points", default="")
    ap.add_argument("--name-column", default="full_name")
    ap.add_argument("--serial-column", help="Column of printed serial numbers; rows without one are skipped")
    ap.add_argument("--qr", action="store_true", help="Also make a QR code image per certificate")
    ap.add_argument("--issued", default=datetime.date.today().strftime("%-d %B %Y") if sys.platform != "win32" else datetime.date.today().strftime("%#d %B %Y"))
    args = ap.parse_args()

    if not re.fullmatch(r"[A-Z0-9]{2,8}", args.prefix):
        sys.exit("--prefix must be 2-8 capital letters or digits.")
    repo = Path(__file__).resolve().parents[2]
    out = args.out.resolve()
    if out == repo or repo in out.parents:
        sys.exit("--out must be outside the website repository: it holds attendees' personal data.")
    out.mkdir(parents=True, exist_ok=True)

    master_path = out / "master.csv"
    master: list[dict] = []
    if master_path.exists():
        with master_path.open(newline="", encoding="utf-8-sig") as f:
            master = list(csv.DictReader(f))
    by_serial = {m["serial"].upper(): m for m in master if m.get("serial")}
    by_email = {m["email"].lower(): m for m in master if m.get("email")}
    by_name = {m["name_as_supplied"].lower(): m for m in master}
    taken = {m["code"] for m in master}

    added, warnings = 0, []
    for person in read_attendees(args.attendees, args.name_column, args.serial_column):
        supplied = person["full_name"]
        serial = person["serial"].upper()
        email = person.get("email", "").lower()
        existing = by_serial.get(serial) if serial else None
        existing = existing or (by_email.get(email) if email else None)
        existing = existing or by_name.get(supplied.lower())
        if existing:
            continue
        code = new_code(args.prefix, taken)
        taken.add(code)
        entry = {
            "code": code,
            "serial": serial,
            "name": tidy_name(supplied),
            "name_as_supplied": supplied,
            "email": person.get("email", ""),
            "organization": person.get("organization", ""),
            "status": "valid",
        }
        master.append(entry)
        by_name[supplied.lower()] = entry
        if serial:
            by_serial[serial] = entry
        if email:
            by_email[email] = entry
        elif not serial:
            warnings.append(f"No email for {supplied}: matched by name on re-runs.")
        added += 1

    master.sort(key=lambda m: (m.get("serial") or "~", m["name"].lower()))
    with master_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, MASTER_FIELDS)
        writer.writeheader()
        writer.writerows({k: m.get(k, "") for k in MASTER_FIELDS} for m in master)

    with (out / "register.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, REGISTER_FIELDS)
        writer.writeheader()
        for m in master:
            writer.writerow({
                "code": m["code"], "serial": m.get("serial", ""), "name": m["name"], "certificate": args.certificate,
                "event": args.event, "dates": args.dates, "venue": args.venue,
                "cpd_points": args.cpd_points, "issued": args.issued, "status": m["status"] or "valid",
            })

    with (out / "mail-merge.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["name", "serial", "email", "code"] + (["qr_file"] if args.qr else []))
        for m in master:
            if m["status"] == "revoked":
                continue
            row = [m["name"], m.get("serial", ""), m.get("email", ""), m["code"]]
            if args.qr:
                import segno

                (out / "qr").mkdir(exist_ok=True)
                qr_file = out / "qr" / f"{m['code']}.png"
                if not qr_file.exists():
                    url = f"{SITE}/certificate-verification?code={m['code']}"
                    segno.make(url, error="m").save(qr_file, scale=10, border=2, dark="#1a1a1a")
                row.append(str(qr_file))
            writer.writerow(row)

    print(f"{added} new code(s); {len(master)} certificate(s) in the register. Files in {out}")
    for w in warnings:
        print("  note:", w)


if __name__ == "__main__":
    main()
