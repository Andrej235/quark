CREATE TABLE "users" (
  "id" UUID PRIMARY KEY NOT NULL,
  "username" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "salt" TEXT NOT NULL,
  "hashed_password" TEXT NOT NULL
);

CREATE TABLE "refresh_tokens" (
  "id" UUID PRIMARY KEY NOT NULL,
  "expire_time" TIMESTAMP NOT NULL,
  "jit" UUID NOT NULL,
  "user_id" UUID NOT NULL REFERENCES "users"("id")
);

CREATE TABLE "teams" (
  "id" UUID PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL
);

CREATE TABLE "team_roles" (
  "id" UUID PRIMARY KEY NOT NULL,
  "team_id" UUID REFERENCES "teams"("id") NOT NULL,
  "name" TEXT NOT NULL
);

CREATE TABLE "team_members" (
  "user_id" UUID REFERENCES "users"("id") NOT NULL,
  "team_id" UUID REFERENCES "teams"("id") NOT NULL,
  "team_role_id" UUID REFERENCES "team_roles"("id") NOT NULL,
  PRIMARY KEY ("user_id", "team_id")
);
