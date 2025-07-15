#!/bin/bash

cd `pwd`/backend
map=$(GENERATE_OPENAPI_MAP=true cargo run)

cd -
echo "export type ApiMap=$map" > `pwd`/desktop/src/api-dsl/api-map.ts