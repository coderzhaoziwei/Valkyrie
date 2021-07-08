#!/bin/sh

NODE_ENV=development yarn rollup --config rollup.config.js

echo ""

if (type pbcopy >/dev/null 2>&1) then
  pbcopy < dist/valkyrie.dev.user.js
  echo "\033[32mcopied\033[1;36m valkyrie.dev.user.js \033[0;32mto clipboard.\033[0m"
else
  echo "\033[31mcommand not found: pbcopy\033[0m"
fi

echo ""
