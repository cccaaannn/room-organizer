import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { items, itemsRelatedItems, itemsTags } from "@/db/schema";


const RemoveItemScheme = z.object({
	id: z.string().uuid()
});

const removeItem = createServerFn({ method: "POST", response: "full" })
	.validator(f => RemoveItemScheme.parse(f))
	.handler(async ctx => {
		const entity = await db.select()
			.from(items)
			.where(eq(items.id, ctx.data.id));

		if (entity.length === 0) {
			throw new Error("Not found");
		}

		await db.delete(itemsTags)
			.where(eq(itemsTags.itemId, ctx.data.id));

		await db.delete(itemsRelatedItems)
			.where(eq(itemsRelatedItems.itemId, ctx.data.id));

		await db.delete(items)
			.where(eq(items.id, ctx.data.id));
	});


export {
	removeItem,
	RemoveItemScheme
};
