#!/usr/bin/env bash
#
# push-staging.sh - send the new commits of one project to its staging repo.
#
#   web   (default)  CSL_WEB   -> remote "staging"        (carinasoftlabsinc/csl-staging)
#   admin            CSL_Admin -> remote "staging-admin"  (carinasoftlabsinc/csl-admin)
#
# A staging repo holds only its project folder, with that folder as its root, so its
# commit hashes differ from this monorepo. This script finds which commits staging
# does not have yet, replays them on top of staging/main one by one (same message,
# author and date), checks that the result is exactly the folder as it is in this
# repo, and pushes it. It never force-pushes and never touches your working tree.
# If the staging repo is still empty, the first push is one commit holding the
# folder as it is at <ref>.
#
# Usage:
#   scripts/push-staging.sh [--project web|admin] [--dry-run] [--yes] [--ref <commit>]
#                           [--allow-mixed] [--allow-env]
#
#   --project      which project to send: web (default) or admin
#   --dry-run      do everything except the push (replay + verify in a temp worktree)
#   --yes          do not ask for confirmation (needed when there is no terminal)
#   --ref <commit> publish up to this commit instead of HEAD
#   --allow-mixed  allow commits that also change other projects (only this
#                  project's part is sent)
#   --allow-env    allow commits that change environment*.ts files
#
# Environment overrides (for testing): STAGING_REMOTE, STAGING_BRANCH (default "main"),
# STAGING_REF (default "<remote>/<branch>").

set -euo pipefail

BRANCH="${STAGING_BRANCH:-main}"
MAX_FILE_BYTES=$((90 * 1024 * 1024)) # GitHub rejects files over 100 MB

PROJECT="web"
DRY_RUN=0
ASSUME_YES=0
ALLOW_MIXED=0
ALLOW_ENV=0
REF="HEAD"

die() { echo "error: $*" >&2; exit 1; }
info() { echo "==> $*"; }

while [ $# -gt 0 ]; do
  case "$1" in
    --project) shift; [ $# -gt 0 ] || die "--project needs a value"; PROJECT="$1" ;;
    --dry-run) DRY_RUN=1 ;;
    --yes | -y) ASSUME_YES=1 ;;
    --allow-mixed) ALLOW_MIXED=1 ;;
    --allow-env) ALLOW_ENV=1 ;;
    --ref) shift; [ $# -gt 0 ] || die "--ref needs a value"; REF="$1" ;;
    -h | --help) sed -n '2,29p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) die "unknown option: $1 (see --help)" ;;
  esac
  shift
done

case "$PROJECT" in
  web) PREFIX="CSL_WEB"; DEFAULT_REMOTE="staging"; EXPECTED_REPO="carinasoftlabsinc/csl-staging" ;;
  admin) PREFIX="CSL_Admin"; DEFAULT_REMOTE="staging-admin"; EXPECTED_REPO="carinasoftlabsinc/csl-admin" ;;
  *) die "unknown project: $PROJECT (use web or admin)" ;;
esac
REMOTE="${STAGING_REMOTE:-$DEFAULT_REMOTE}"

ROOT="$(git rev-parse --show-toplevel)" || die "not inside a git repository"
cd "$ROOT"
[ -d "$PREFIX" ] || die "$PREFIX folder not found in $ROOT"

# --- safety: the remote must really be the staging repo ------------------------
URL="$(git remote get-url --push "$REMOTE" 2>/dev/null)" || die "git remote '$REMOTE' is not configured"
case "$URL" in
  *"$EXPECTED_REPO"*) ;;
  *) die "remote '$REMOTE' points at '$URL', not $EXPECTED_REPO - refusing to continue" ;;
esac

TIP="$(git rev-parse --verify "$REF^{commit}")" || die "cannot resolve $REF"
TIP_TREE="$(git rev-parse "$TIP:$PREFIX")" || die "$PREFIX does not exist at $REF"

confirm_and_push() { # <commit> <description>
  if [ "$DRY_RUN" -eq 1 ]; then
    info "Dry run: nothing pushed."
    exit 0
  fi
  if [ "$ASSUME_YES" -eq 0 ]; then
    [ -t 0 ] || die "no terminal to confirm on - pass --yes"
    read -r -p "Push $2 to $REMOTE/$BRANCH? [y/N] " answer
    case "$answer" in y | Y | yes | YES) ;; *) die "cancelled" ;; esac
  fi
  git push "$REMOTE" "$1:refs/heads/$BRANCH"
  git fetch --quiet "$REMOTE" "$BRANCH"
  git branch -f "staging-$PROJECT" "$REMOTE/$BRANCH" >/dev/null 2>&1 || true
  info "Pushed. $REMOTE/$BRANCH is now $(git rev-parse --short "$1")."
}

# --- what staging has now, and what we want it to have -------------------------
info "Fetching $REMOTE"
if [ -z "${STAGING_REF:-}" ] && [ -z "$(git ls-remote --heads "$REMOTE" "$BRANCH")" ]; then
  # Empty staging repo: send the folder as one first commit (no monorepo history).
  info "$REMOTE has no '$BRANCH' branch yet: first push of $PREFIX at $(git rev-parse --short "$TIP")"
  big="$(git ls-tree -r -l "$TIP_TREE" | awk -v max="$MAX_FILE_BYTES" '$4 > max {print $4, $5}')"
  [ -z "$big" ] || die "file(s) too large for GitHub (over 90 MB):
$big"
  FIRST="$(git commit-tree "$TIP_TREE" -m "chore($PROJECT): first import of $PREFIX at $(git rev-parse --short "$TIP")")"
  info "$(git ls-tree -r "$TIP_TREE" | wc -l | tr -d ' ') files, commit $(git rev-parse --short "$FIRST")"
  confirm_and_push "$FIRST" "the first commit"
  exit 0
fi
git fetch --quiet "$REMOTE" "$BRANCH"
STAGING_REF="${STAGING_REF:-$REMOTE/$BRANCH}"
STAGING_COMMIT="$(git rev-parse --verify "$STAGING_REF^{commit}")" || die "cannot resolve $STAGING_REF"
STAGING_TREE="$(git rev-parse "$STAGING_COMMIT^{tree}")"

if [ "$TIP_TREE" = "$STAGING_TREE" ]; then
  info "Staging already matches $PREFIX at $(git rev-parse --short "$TIP"). Nothing to push."
  exit 0
fi

# Newest commit (on the first-parent line) whose CSL_WEB folder is exactly what staging has.
BASE=""
while read -r c; do
  if [ "$(git rev-parse "$c:$PREFIX" 2>/dev/null || true)" = "$STAGING_TREE" ]; then
    BASE="$c"
    break
  fi
done < <(git rev-list --first-parent "$TIP" -- "$PREFIX")

if [ -z "$BASE" ]; then
  # A merge can put what staging has on a second parent (e.g. after someone merged this branch into theirs).
  # Then send the difference as one commit instead of replaying commit by commit.
  while read -r c; do
    if [ "$(git rev-parse "$c:$PREFIX" 2>/dev/null || true)" = "$STAGING_TREE" ]; then
      BASE="$c"
      break
    fi
  done < <(git rev-list "$TIP" -- "$PREFIX")
  if [ -n "$BASE" ]; then
    info "Staging is at $(git rev-parse --short "$STAGING_COMMIT"), equal to $PREFIX at $(git rev-parse --short "$BASE") (reached through a merge)"
    info "Sending everything since then as one commit: $(git log -1 --format=%s "$TIP")"
    git diff --stat "$STAGING_TREE" "$TIP_TREE" | tail -1
    NEW_HEAD="$(git commit-tree "$TIP_TREE" -p "$STAGING_COMMIT" -m "$(git log -1 --format=%B "$TIP")")"
    [ "$(git rev-parse "$NEW_HEAD^{tree}")" = "$TIP_TREE" ] || die "verification failed - nothing was pushed"
    info "Verified: staging would match $PREFIX at $(git rev-parse --short "$TIP") exactly."
    confirm_and_push "$NEW_HEAD" "1 commit"
    exit 0
  fi
  die "staging's files do not match any $PREFIX commit on this branch.
Staging was probably changed directly, or this branch is not based on what was pushed.
Compare with: git diff --stat $STAGING_REF $TIP:$PREFIX"
fi

mapfile -t PENDING < <(git rev-list --first-parent --reverse "$BASE..$TIP" -- "$PREFIX")
[ "${#PENDING[@]}" -gt 0 ] || die "no pending commits found (unexpected)"

info "Staging is at $(git rev-parse --short "$STAGING_COMMIT"), equal to $PREFIX at $(git rev-parse --short "$BASE")"
info "${#PENDING[@]} commit(s) to send:"
for c in "${PENDING[@]}"; do
  n=$(git diff --name-only "$c^1" "$c" -- "$PREFIX" | wc -l | tr -d ' ')
  printf '    %s  %s  (%s files)\n' "$(git rev-parse --short "$c")" "$(git log -1 --format=%s "$c")" "$n"
done

# --- guards on what is being sent ----------------------------------------------
for c in "${PENDING[@]}"; do
  s="$(git rev-parse --short "$c")"
  if [ "$ALLOW_MIXED" -eq 0 ]; then
    other="$(git diff --name-only "$c^1" "$c" -- . ":(exclude)$PREFIX" | head -3)"
    [ -z "$other" ] || die "commit $s also changes files outside $PREFIX (e.g. $(echo "$other" | head -1)).
Split it into one commit per project, or pass --allow-mixed to send only the $PREFIX part."
  fi
  if [ "$ALLOW_ENV" -eq 0 ]; then
    env="$(git diff --name-only "$c^1" "$c" -- "$PREFIX" | grep -E '(^|/)(environment[^/]*\.ts|\.env[^/]*)$' || true)"
    [ -z "$env" ] || die "commit $s changes an environment file ($(echo "$env" | head -1)). Pass --allow-env if that is intended."
  fi
done

# --- replay on top of staging in a throw-away worktree -------------------------
WORK="$(mktemp -d)"
WT="$WORK/wt"
cleanup() {
  git worktree remove --force "$WT" >/dev/null 2>&1 || true
  rm -rf "$WORK"
  git worktree prune >/dev/null 2>&1 || true
}
trap cleanup EXIT

git worktree add --quiet --detach "$WT" "$STAGING_COMMIT"

for c in "${PENDING[@]}"; do
  s="$(git rev-parse --short "$c")"
  git diff --binary --relative="$PREFIX" "$c^1" "$c" -- "$PREFIX" >"$WORK/patch"
  if [ ! -s "$WORK/patch" ]; then
    info "skip $s (no changes inside $PREFIX)"
    continue
  fi
  git -C "$WT" apply --index --binary --whitespace=nowarn "$WORK/patch" || die "commit $s does not apply on top of staging"
  git log -1 --format=%B "$c" >"$WORK/msg"
  GIT_AUTHOR_NAME="$(git log -1 --format=%an "$c")" \
  GIT_AUTHOR_EMAIL="$(git log -1 --format=%ae "$c")" \
  GIT_AUTHOR_DATE="$(git log -1 --format=%aI "$c")" \
    git -C "$WT" commit --quiet --allow-empty-message -F "$WORK/msg"
done

# --- verify: staging must end up exactly equal to CSL_WEB at the tip ------------
NEW_HEAD="$(git -C "$WT" rev-parse HEAD)"
NEW_TREE="$(git -C "$WT" rev-parse 'HEAD^{tree}')"
if [ "$NEW_TREE" != "$TIP_TREE" ]; then
  echo "result differs from $PREFIX at $(git rev-parse --short "$TIP"):" >&2
  git diff --stat "$NEW_TREE" "$TIP_TREE" >&2 || true
  die "verification failed - nothing was pushed"
fi

big="$(git -C "$WT" ls-tree -r -l HEAD | awk -v max="$MAX_FILE_BYTES" '$4 > max {print $4, $5}')"
[ -z "$big" ] || die "file(s) too large for GitHub (over 90 MB):
$big"

info "Verified: staging would match $PREFIX at $(git rev-parse --short "$TIP") exactly."

# --- push (never forced) --------------------------------------------------------
confirm_and_push "$NEW_HEAD" "${#PENDING[@]} commit(s)"
