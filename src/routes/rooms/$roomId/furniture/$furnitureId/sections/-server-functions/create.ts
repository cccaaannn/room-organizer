import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { furniture, sections } from "@/db/schema";
import { currentUserMiddleware } from "@/middlewares/current-user-middleware";


const CreateSectionScheme = z.object({
	furnitureId: z.string().uuid(),
	name: z.string().min(1, { message: "Name is required" }).max(250, { message: "Name must be less than 250 characters" }),
	description: z.string().max(1000, { message: "Description must be less than 500 characters" })
});

const createSection = createServerFn({ method: "POST", response: "full" })
	.validator(f => CreateSectionScheme.parse(f))
	.middleware([currentUserMiddleware])
	.handler(async ctx => {
		const existingFurniture = await db.select()
			.from(furniture)
			.where(and(
				eq(furniture.id, ctx.data.furnitureId),
				eq(furniture.userId, ctx.context.user.id)
			));

		if (existingFurniture.length === 0) {
			throw new Error("Furniture not found");
		}

		const entity: typeof sections.$inferInsert = {
			name: ctx.data.name,
			description: ctx.data.description,
			furnitureId: ctx.data.furnitureId,
			userId: ctx.context.user.id
		};

		const existingEntity = await db.select()
			.from(sections)
			.where(and(eq(sections.name, ctx.data.name), eq(sections.furnitureId, ctx.data.furnitureId)));

		if (existingEntity.length > 0) {
			throw new Error("Name is in use");
		}

		return await db.insert(sections)
			.values(entity)
			.returning()
			.then(res => res[0]);
	});


export {
	createSection,
	CreateSectionScheme
};
