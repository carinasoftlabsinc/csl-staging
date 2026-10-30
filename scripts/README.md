# scripts

## push-staging.sh

Sends new commits of one project to its staging repo (branch `main`):

| Project | Folder | Remote | Repo |
| --- | --- | --- | --- |
| `web` (default) | `CSL_WEB` | `staging` | [carinasoftlabsinc/csl-staging](https://github.com/carinasoftlabsinc/csl-staging) (hosted on Netlify) |
| `admin` | `CSL_Admin` | `staging-admin` | [carinasoftlabsinc/csl-admin](https://github.com/carinasoftlabsinc/csl-admin) |

A staging repo holds only its project folder, so its commit hashes differ from this repo. The script finds the
commits staging does not have yet, replays them (same message, author and date), checks the result matches the
folder exactly, and pushes. It never force-pushes and never changes your working tree. If the staging repo is
still empty, the first push is a single commit with the folder as it is now.

### Run it

From the repo root, in Git Bash:

```
scripts/push-staging.sh --dry-run                   # website: show what would be sent, push nothing
scripts/push-staging.sh                             # website: ask "y/N", then push
scripts/push-staging.sh --project admin --dry-run   # admin panel: show what would be sent
scripts/push-staging.sh --project admin             # admin panel: ask "y/N", then push
```

Add `--yes` to push without asking.

Always do a `--dry-run` first. Commit your work before running it; uncommitted changes are not sent.

### Options

| Option | What it does |
| --- | --- |
| `--project web\|admin` | Which project to send. Default `web`. |
| `--dry-run` | Replay and verify everything, but do not push. |
| `--yes`, `-y` | Do not ask for confirmation (needed when there is no terminal). |
| `--ref <commit>` | Send up to this commit instead of `HEAD`. |
| `--allow-mixed` | Allow a commit that also changes other projects. Only this project's part is sent. |
| `--allow-env` | Allow a commit that changes `environment*.ts` files. |

### What it refuses to do

- Push to any remote other than the project's staging repo.
- Send a commit that changes files outside the project folder (use one commit per project, or pass `--allow-mixed`).
- Send changes to environment files (pass `--allow-env` if that is intended).
- Send a file over 90 MB (GitHub rejects files over 100 MB).
- Push if the result does not match the project folder exactly. Nothing is pushed in that case.

### Messages you may see

| Message | Meaning |
| --- | --- |
| `Staging already matches CSL_WEB … Nothing to push.` | Nothing new to send. |
| `staging's files do not match any CSL_WEB commit on this branch` | Staging was changed directly, or you are on a branch that does not contain what was pushed last. Compare with the `git diff --stat` command the message prints. |
| `commit … also changes files outside CSL_WEB` | Split the commit per project, or use `--allow-mixed`. |
| `commit … does not apply on top of staging` | Staging and this branch have drifted apart. Do not force it; check the differences first. |
| `no terminal to confirm on - pass --yes` | You ran it without a terminal. Add `--yes`. |

### After a push

For the website, Netlify rebuilds from `main` on its own. The local branch `staging-web` (or `staging-admin`) is moved to the new remote `main`.

### Setup

The remotes must exist:

```
git remote add staging https://github.com/carinasoftlabsinc/csl-staging.git
git remote add staging-admin https://github.com/carinasoftlabsinc/csl-admin.git
```

You need push access to those repos.
