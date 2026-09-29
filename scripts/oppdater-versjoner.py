#!/usr/bin/env python3
"""Setter ?v=<innholdshash> på alle lokale CSS-, JS- og ikonlenker i HTML-filene.

Kanten cacher assets i 4 timer uansett hva _headers sier, så en fil som endres
uten ny URL serveres gammel. Før 29.09.2026 ble ?v= bumpet for hånd, og det ble
glemt (vaer.js 12.09). Nå følger versjonen innholdet: endret fil = ny URL,
uendret fil = samme URL. Idempotent — kjør så ofte du vil.

Bilder dekkes ikke: de får nytt filnavn når innholdet endres (se DEPLOY.md).
"""
import hashlib
import pathlib
import re
import sys

ROT = pathlib.Path(__file__).resolve().parent.parent
LENKE = re.compile(
    r'((?:href|src)="/)'
    r'(assets/[^"?]+\.(?:css|js)|favicon\.png|favicon\.ico|apple-touch-icon\.png)'
    r'(?:\?v=[^"]*)?"'
)


def main() -> int:
    hasher: dict[str, str] = {}
    mangler: set[str] = set()
    endret = []

    def ny(m: re.Match) -> str:
        sti = m.group(2)
        if sti not in hasher:
            fil = ROT / sti
            if not fil.is_file():
                mangler.add(sti)
                return m.group(0)
            hasher[sti] = hashlib.sha256(fil.read_bytes()).hexdigest()[:10]
        return f'{m.group(1)}{sti}?v={hasher[sti]}"'

    html_filer = sorted(p for p in ROT.rglob("*.html")
                        if not {".git", "tasks", "docs", "scripts", ".wrangler"} & set(p.relative_to(ROT).parts))
    for f in html_filer:
        gammel = f.read_text(encoding="utf-8")
        tekst = LENKE.sub(ny, gammel)
        if tekst != gammel:
            f.write_text(tekst, encoding="utf-8")
            endret.append(f.relative_to(ROT))

    for sti, h in sorted(hasher.items()):
        print(f"  {sti:28} ?v={h}")
    print(f"  {len(endret)} HTML-fil(er) fikk nye versjonsnumre")
    if mangler:
        print("FEIL: HTML peker på filer som ikke finnes: " + ", ".join(sorted(mangler)), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
