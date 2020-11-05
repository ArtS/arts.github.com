#!/usr/bin/env bash
# uses https://github.com/bezoerb/grunt-critical
# cat ./_site/index.html | critical -b ./_site > ./_includes/critical.css
cat ./_site/how-to-quickly-run-some-csharp-code-without-creating-a-project/index.html | critical -b ./_site > ./_includes/critical.css
