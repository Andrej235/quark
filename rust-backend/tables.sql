CREATE TABLE "teams" (
  "id" UUID PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT
);

CREATE TABLE "users" (
  "id" UUID PRIMARY KEY NOT NULL,
  "username" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "profile_picture" BYTEA,
  "is_email_verified" BOOLEAN NOT NULL,
  "email" TEXT NOT NULL,
  "salt" TEXT NOT NULL,
  "hashed_password" TEXT NOT NULL,

  "default_team_id" UUID REFERENCES "teams"("id") ON DELETE SET NULL
);

CREATE TABLE "user_settings" (
  "id" BIGINT PRIMARY KEY NOT NULL,
  "user_id" UUID NOT NULL REFERENCES "users"("id")
);

CREATE TABLE "refresh_tokens" (
  "id" UUID PRIMARY KEY NOT NULL,
  "expire_time" TIMESTAMP NOT NULL,
  "jit" UUID NOT NULL,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
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

  "joined_at" TIMESTAMP NOT NULL,

  PRIMARY KEY ("user_id", "team_id")
);

CREATE TABLE "team_invitations" (
  "token" TEXT NOT NULL PRIMARY KEY,
  "expires_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" SMALLINT NOT NULL,

  "team_id" UUID NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "sender_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "receiver_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);