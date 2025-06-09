import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { itemsTags, tags } from "@/db/schema";


const RemoveTagScheme = z.object({
	id: z.string().uuid()
});

const removeTag = createServerFn({ method: "POST", response: "full" })
	.validator(f => RemoveTagScheme.parse(f))
	.handler(async ctx => {
		const entity = await db.select()
			.from(tags)
			.where(eq(tags.id, ctx.data.id));

		if (entity.length === 0) {
			throw new Error("Not found");
		}

		await db.delete(itemsTags)
			.where(eq(itemsTags.tagId, ctx.data.id));

		await db.delete(tags)
			.where(eq(tags.id, ctx.data.id));
	});


export {
	removeTag,
	RemoveTagScheme
};
