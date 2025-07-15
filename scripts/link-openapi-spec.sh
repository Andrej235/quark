#!/bin/bash

cd `pwd`/backend
spec=$(GENERATE_API_SPEC=true cargo run)

cd -
echo "export type ApiSpec=$spec" > `pwd`/desktop/src/api-dsl/api-spec.ts