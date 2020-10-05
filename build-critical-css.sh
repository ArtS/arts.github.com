#!/bin/env bash
cat ./_site/index.html | critical -b ./dist > ./critical.css
