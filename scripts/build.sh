#!/bin/sh

yarn version --no-git-tag-version --patch

NODE_ENV=production yarn rollup --config rollup.config.js
