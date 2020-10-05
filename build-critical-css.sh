#!/usr/bin/env bash
# uses https://github.com/bezoerb/grunt-critical
cat ./_site/index.html | critical -b ./dist > ./_includes/critical.css
