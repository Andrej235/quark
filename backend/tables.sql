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
<<<<<<< HEAD
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
=======
  "user_id" UUID NOT NULL REFERENCES "users"("id")
>>>>>>> origin/main
);

CREATE TABLE "teams" (
  "id" UUID PRIMARY KEY NOT NULL,
<<<<<<< HEAD
  "name" TEXT NOT NULL,
  "description" TEXT
=======
  "name" TEXT NOT NULL
>>>>>>> origin/main
);

CREATE TABLE "team_roles" (
  "id" UUID PRIMARY KEY NOT NULL,
<<<<<<< HEAD
  "team_id" UUID NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
=======
  "team_id" UUID REFERENCES "teams"("id") NOT NULL,
>>>>>>> origin/main
  "name" TEXT NOT NULL
);

CREATE TABLE "team_members" (
<<<<<<< HEAD
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "team_id" UUID NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "team_role_id" UUID NOT NULL REFERENCES "team_roles"("id"),
=======
  "user_id" UUID REFERENCES "users"("id") NOT NULL,
  "team_id" UUID REFERENCES "teams"("id") NOT NULL,
  "team_role_id" UUID REFERENCES "team_roles"("id") NOT NULL,
>>>>>>> origin/main
  PRIMARY KEY ("user_id", "team_id")
);
