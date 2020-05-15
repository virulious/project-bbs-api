#!/bin/bash

API="http://localhost:4741"
URL_PATH="/posts"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Authorization: Token token=${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "posts": {
      "title": "'"${TITLE}"'",
      "body": "'"${BODY}"'",
    }
  }'

echo
