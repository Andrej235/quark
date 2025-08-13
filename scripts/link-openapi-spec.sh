#!/bin/bash

dotnet clean
dotnet restore
dotnet build
dotnet build /t:GenerateOpenApiDocuments

spec=$(cat `pwd`/backend/api-docs/open-api-documentation.json)

cd -
echo "export type ApiSpec=$spec" > `pwd`/src/api-dsl/api-spec.ts