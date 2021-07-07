#!/bin/sh

yarn rollup --config rollup.config.js

echo ""

if (type pbcopy >/dev/null 2>&1) then
  pbcopy < dist/valkyrie.user.js
  echo "\033[32mcopied\033[1;36m valkyrie.user.js \033[0;32mto clipboard.\033[0m"
else
  echo "\033[31mcommand not found: pbcopy\033[0m"
fi
