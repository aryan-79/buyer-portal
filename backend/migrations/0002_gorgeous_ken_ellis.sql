CREATE UNIQUE INDEX "favourites_user_property_uidx" ON "favourites" USING btree ("user_id","property_id");--> statement-breakpoint
CREATE INDEX "favourites_property_idx" ON "favourites" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "propery_id_idx" ON "properties" USING btree ("id");