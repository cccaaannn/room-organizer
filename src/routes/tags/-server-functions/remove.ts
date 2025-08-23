import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { itemsTags, tags } from "@/db/schema";
import { currentUserMiddleware } from "@/middlewares/current-user-middleware";


const RemoveTagScheme = z.object({
	id: z.string().uuid()
});

const removeTag = createServerFn({ method: "POST", response: "full" })
	.validator(f => RemoveTagScheme.parse(f))
	.middleware([currentUserMiddleware])
	.handler(async ctx => {
		const entity = await db.select()
			.from(tags)
			.where(and(
				eq(tags.id, ctx.data.id),
				eq(tags.userId, ctx.context.user.id)
			));

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
