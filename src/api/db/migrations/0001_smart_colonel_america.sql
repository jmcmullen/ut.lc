-- Step 1: Add new columns and prepare for migration
ALTER TABLE "urls" ADD COLUMN "new_id" text;
--> statement-breakpoint
ALTER TABLE "urls" ADD COLUMN "slug" varchar(32);
--> statement-breakpoint
ALTER TABLE "clicks" ADD COLUMN "new_id" text;
--> statement-breakpoint
ALTER TABLE "clicks" ADD COLUMN "new_urlId" text;

--> statement-breakpoint
-- Step 2: Populate new columns with prefixed IDs and copy existing IDs to slugs
UPDATE "urls" SET "new_id" = 'url_' || substr(md5(random()::text || clock_timestamp()::text), 1, 26), "slug" = "id";
--> statement-breakpoint
UPDATE "clicks" SET "new_id" = 'clk_' || substr(md5(random()::text || clock_timestamp()::text), 1, 26);
--> statement-breakpoint
UPDATE "clicks" SET "new_urlId" = "urls"."new_id" FROM "urls" WHERE "clicks"."urlId" = "urls"."id";

--> statement-breakpoint
-- Step 3: Drop foreign key constraints
ALTER TABLE "clicks" DROP CONSTRAINT IF EXISTS "clicks_urlId_urls_id_fk";
--> statement-breakpoint
ALTER TABLE "urls" DROP CONSTRAINT IF EXISTS "urls_userId_user_id_fk";

--> statement-breakpoint
-- Step 4: Drop old columns and rename new ones
ALTER TABLE "clicks" DROP COLUMN "id";
--> statement-breakpoint
ALTER TABLE "clicks" DROP COLUMN "urlId";
--> statement-breakpoint
ALTER TABLE "clicks" RENAME COLUMN "new_id" TO "id";
--> statement-breakpoint
ALTER TABLE "clicks" RENAME COLUMN "new_urlId" TO "urlId";
--> statement-breakpoint
ALTER TABLE "urls" DROP COLUMN "id";
--> statement-breakpoint
ALTER TABLE "urls" RENAME COLUMN "new_id" TO "id";

--> statement-breakpoint
-- Step 5: Add constraints
ALTER TABLE "urls" ALTER COLUMN "id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "urls" ALTER COLUMN "slug" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "clicks" ALTER COLUMN "id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "clicks" ALTER COLUMN "urlId" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "urls" ADD PRIMARY KEY ("id");
--> statement-breakpoint
ALTER TABLE "clicks" ADD PRIMARY KEY ("id");
--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_slug_unique" UNIQUE("slug");
--> statement-breakpoint
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_urlId_urls_id_fk" FOREIGN KEY ("urlId") REFERENCES "public"."urls"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;