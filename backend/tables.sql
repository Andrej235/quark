CREATE TABLE "users" (
  "id" UUID PRIMARY KEY NOT NULL,
  "username" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "profile_picture" BYTEA,
  "is_email_verified" BOOLEAN NOT NULL,
  "email" TEXT NOT NULL,
  "salt" TEXT NOT NULL,
  "hashed_password" TEXT NOT NULL
);

CREATE TABLE "refresh_tokens" (
  "id" UUID PRIMARY KEY NOT NULL,
  "expire_time" TIMESTAMP NOT NULL,
  "jit" UUID NOT NULL,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "teams" (
  "id" UUID PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT
);

CREATE TABLE "team_roles" (
  "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  "team_id" UUID NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "permissions" INTEGER NOT NULL
);

CREATE TABLE "team_members" (
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "team_id" UUID NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "team_role_id" BIGINT NOT NULL REFERENCES "team_roles"("id"),
  PRIMARY KEY ("user_id", "team_id")
);
