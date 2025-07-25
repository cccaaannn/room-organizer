import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { items, sections } from "@/db/schema";
import { currentUserMiddleware } from "@/middlewares/current-user-middleware";


const RemoveSectionScheme = z.object({
	id: z.string().uuid()
});

const removeSection = createServerFn({ method: "POST", response: "full" })
	.validator(f => RemoveSectionScheme.parse(f))
	.middleware([currentUserMiddleware])
	.handler(async ctx => {
		const entity = await db.select()
			.from(sections)
			.where(and(
				eq(sections.id, ctx.data.id),
				eq(sections.userId, ctx.context.user.id)
			));

		if (entity.length === 0) {
			throw new Error("Not found");
		}

		const itemList = await db.select()
			.from(items)
			.where(eq(items.sectionId, ctx.data.id));

		if (itemList.length > 0) {
			throw new Error("Cannot delete section with items");
		}

		await db.delete(sections)
			.where(eq(sections.id, ctx.data.id));
	});


export {
	removeSection,
	RemoveSectionScheme
};
