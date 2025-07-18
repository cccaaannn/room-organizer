import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { furniture, sections } from "@/db/schema";
import { currentUserMiddleware } from "@/middlewares/current-user-middleware";


const RemoveFurnitureScheme = z.object({
	id: z.string().uuid()
});

const removeFurniture = createServerFn({ method: "POST", response: "full" })
	.validator(f => RemoveFurnitureScheme.parse(f))
	.middleware([currentUserMiddleware])
	.handler(async ctx => {
		const entity = await db.select()
			.from(furniture)
			.where(and(
				eq(furniture.id, ctx.data.id),
				eq(furniture.userId, ctx.context.user.id)
			));

		if (entity.length === 0) {
			throw new Error("Not found");
		}

		const sectionList = await db.select()
			.from(sections)
			.where(eq(sections.furnitureId, ctx.data.id));

		if (sectionList.length > 0) {
			throw new Error("Cannot delete furniture with sections");
		}

		await db.delete(furniture)
			.where(eq(furniture.id, ctx.data.id));
	});


export {
	removeFurniture,
	RemoveFurnitureScheme
};
