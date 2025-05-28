CREATE TABLE "clicks" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"urlId" varchar(10) NOT NULL,
	"clickedAt" timestamp DEFAULT now() NOT NULL,
	"userAgent" text,
	"browser" varchar(50),
	"browserVersion" varchar(20),
	"os" varchar(50),
	"osVersion" varchar(20),
	"device" varchar(50),
	"ip" varchar(45),
	"country" varchar(2),
	"region" varchar(255),
	"city" varchar(255),
	"latitude" varchar(20),
	"longitude" varchar(20),
	"referrer" text,
	"referrerDomain" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "urls" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp,
	"url" text NOT NULL,
	"userId" varchar(255),
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_urlId_urls_id_fk" FOREIGN KEY ("urlId") REFERENCES "public"."urls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clicks_urlId_index" ON "clicks" USING btree ("urlId");--> statement-breakpoint
CREATE INDEX "clicks_clickedAt_index" ON "clicks" USING btree ("clickedAt");--> statement-breakpoint
CREATE INDEX "clicks_country_index" ON "clicks" USING btree ("country");--> statement-breakpoint
CREATE INDEX "urls_userId_index" ON "urls" USING btree ("userId");