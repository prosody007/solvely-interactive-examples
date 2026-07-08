#!/usr/bin/env bash
set -euo pipefail

SKILL_ID="${MULTICA_SKILL_ID:-b33027ee-0a7d-40d1-b701-48ead51bb621}"
SKILL_DIR="${SKILL_DIR:-.agents/skills/solvely-ios-interactions}"
MULTICA_SERVER_URL="${MULTICA_SERVER_URL:-https://api.multica.ai}"
MULTICA_APP_URL="${MULTICA_APP_URL:-https://multica.ai}"
MULTICA_WORKSPACE_ID="${MULTICA_WORKSPACE_ID:-3e67a813-1c54-4e84-95a6-ce8e6aa8f073}"

if ! command -v multica >/dev/null 2>&1; then
  echo "multica CLI is not installed." >&2
  echo "Install it with: brew install multica-ai/tap/multica" >&2
  exit 1
fi

multica config set server_url "$MULTICA_SERVER_URL" >/dev/null
multica config set app_url "$MULTICA_APP_URL" >/dev/null
multica config set workspace_id "$MULTICA_WORKSPACE_ID" >/dev/null

if [[ -n "${MULTICA_TOKEN:-}" ]]; then
  multica login --token "$MULTICA_TOKEN" >/dev/null
fi

if [[ ! -f "$SKILL_DIR/SKILL.md" ]]; then
  echo "Missing $SKILL_DIR/SKILL.md" >&2
  exit 1
fi

multica skill update "$SKILL_ID" \
  --content-file "$SKILL_DIR/SKILL.md" \
  --output json >/dev/null

upsert_file() {
  local source_file="$1"
  local skill_path="$2"

  if [[ ! -f "$source_file" ]]; then
    echo "Missing $source_file" >&2
    exit 1
  fi

  multica skill files upsert "$SKILL_ID" \
    --path "$skill_path" \
    --content-file "$source_file" \
    --output json >/dev/null
}

upsert_file "$SKILL_DIR/references/home-experiment-b-tabbar.md" "references/home-experiment-b-tabbar.md"
upsert_file "$SKILL_DIR/references/add-bottom-sheet.md" "references/add-bottom-sheet.md"
upsert_file "$SKILL_DIR/references/lottie-camera-button.md" "references/lottie-camera-button.md"
upsert_file "$SKILL_DIR/references/figma-assets.md" "references/figma-assets.md"

upsert_file "docs/animation-catalog.md" "references/animation-catalog.md"
upsert_file "docs/integration-guide.md" "references/integration-guide.md"
upsert_file "docs/figma-export-rules.md" "references/figma-export-rules.md"

echo "Synced Multica skill $SKILL_ID"
