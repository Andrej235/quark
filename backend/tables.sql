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

CREATE TABLE "team" (
  "id" UUID PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL
)

CREATE TABLE "team_role" (
  "team_id" UUID REFERENCES "team"("id"),
  "name" TEXT NOT NULL
  PRIMARY KEY ("team_id", "name")
)

CREATE TABLE "team_member" (
  "user_id" UUID FOREIGN KEY REFERENCES "user"("id"),
  "team_id" UUID FOREIGN KEY REFERENCES "team"("id"),
  "role_id" UUID FOREIGN KEY REFERENCES "role"("id"),
  PRIMARY KEY ("user_id", "team_id"),
)
