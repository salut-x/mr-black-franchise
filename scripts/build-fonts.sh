#!/usr/bin/env bash
# Собирает public/fonts/*.woff2 из оригиналов в src/assets/fonts.
# Оригиналы содержат весь набор глифов Google Fonts; на странице нужны только
# латиница, кириллица, пунктуация и знак рубля — сабсет режет вес втрое.
set -euo pipefail

SRC='src/assets/fonts'
OUT='public/fonts'
UNICODES='U+0020-007E,U+00A0-00FF,U+0400-045F,U+0490-0491,U+2000-206F,U+2116,U+20A0-20BF,U+2212'
FONTS=(InterTight-Regular CourierPrime-Regular Unbounded-ExtraBold)

command -v pyftsubset >/dev/null || {
	echo 'pyftsubset не найден: pip3 install fonttools brotli' >&2
	exit 1
}

mkdir -p "$OUT"

for font in "${FONTS[@]}"; do
	pyftsubset "$SRC/$font.woff2" \
		--unicodes="$UNICODES" \
		--layout-features='*' \
		--flavor=woff2 \
		--output-file="$OUT/$font.woff2"

	printf '%-24s %7s -> %7s\n' "$font" \
		"$(wc -c <"$SRC/$font.woff2")" \
		"$(wc -c <"$OUT/$font.woff2")"
done
