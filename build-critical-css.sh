#!/usr/bin/env bash
cat ./_site/index.html | critical -b ./dist > ./_includes/critical.css
