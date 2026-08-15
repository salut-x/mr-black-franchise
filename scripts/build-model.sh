#!/usr/bin/env bash
# Собирает public/models/cup.glb из исходного экспорта Blender.
# Логотип в GLB — только hero-вариант; cup-3/cup-4 подменяются в рантайме
# через createTexture(), см. src/scripts/modules/CupSection.js
set -euo pipefail

SRC="${1:-src/models/coffee1.glb}"
OUT="public/models/cup.glb"
GT="npx --yes @gltf-transform/cli@4"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# 1. Декали-логотипы: 1344x2048 -> 512 по ширине (на экране занимают ~200px)
$GT resize "$SRC" "$TMP/a.glb" --pattern '*cup*' --width 512 --height 768
# 2. Остальное: потолок 1024 (модель рендерится в 70vmin ~ 700px)
$GT resize "$TMP/a.glb" "$TMP/b.glb" --width 1024 --height 1024
# 3. Нормали — щадящее качество, лоси на них дают полосы в бликах
$GT webp "$TMP/b.glb" "$TMP/c.glb" --slots normalTexture --quality 95
$GT webp "$TMP/c.glb" "$TMP/d.glb" --quality 85
# 4. resize/webp разжимают Draco — возвращаем
$GT draco "$TMP/d.glb" "$OUT"

$GT inspect "$OUT" | sed -n '/TEXTURES/,/└/p'
