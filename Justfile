install:
  bun install --frozen-lockfile

build: install
  bun run build

deploy: build
  #!/usr/bin/env bash
  set -euxo pipefail
  AWS_REGION=hel1 \
  AWS_ACCESS_KEY_ID=$(op read "op://Private/ci-website-push/accessKey") \
  AWS_SECRET_ACCESS_KEY=$(op read "op://Private/ci-website-push/secretKey") \
  S3_ENDPOINT_URL="https://hel1.your-objectstorage.com" \
  s5cmd sync --delete ./dist/ s3://hayden-www
