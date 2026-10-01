install:
  bun install --frozen-lockfile

build: install
  bun run build

deploy: build
  #!/usr/bin/env bash
  set -euxo pipefail
  AWS_ACCESS_KEY_ID=$(op read "op://Private/ci-website-push/accessKey") \
  AWS_SECRET_ACCESS_KEY=$(op read "op://Private/ci-website-push/secretKey") \
  S3_ENDPOINT_URL="https://s3.hayden.moe" \
  s5cmd --endpoint-url=https://s3.hayden.moe sync --delete ./dist/ s3://hayden.moe
