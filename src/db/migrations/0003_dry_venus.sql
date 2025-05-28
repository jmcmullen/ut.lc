ALTER TABLE "clicks" ADD COLUMN "ipHash" varchar(64);--> statement-breakpoint
CREATE INDEX "clicks_ipHash_index" ON "clicks" USING btree ("ipHash");