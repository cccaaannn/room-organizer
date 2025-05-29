import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { furniture } from "@/db/schema";


const UpdateFurnitureScheme = z.object({
	id: z.string().uuid(),
	roomId: z.string().uuid(),
	name: z.string().min(1, { message: "Name is required" }).max(250, { message: "Name must be less than 250 characters" }),
	description: z.string().max(1000, { message: "Description must be less than 500 characters" })
});

const updateFurniture = createServerFn({ method: "POST", response: "full" })
	.validator(f => UpdateFurnitureScheme.parse(f))
	.handler(async ctx => {
		const entity = await db.select()
			.from(furniture)
			.where(eq(furniture.id, ctx.data.id));

		if (entity.length === 0) {
			throw new Error("Not found");
		}

		if (entity[0].name !== ctx.data.name) {
			const existingTag = await db.select()
				.from(furniture)
				.where(and(eq(furniture.name, ctx.data.name), eq(furniture.roomId, ctx.data.roomId)));

			if (existingTag.length > 0) {
				throw new Error("Name is in use");
			}
		}

		return await db.update(furniture)
			.set({
				name: ctx.data.name,
				description: ctx.data.description,
				roomId: ctx.data.roomId,
				updatedAt: sql`NOW()`
			})
			.where(eq(furniture.id, ctx.data.id))
			.returning()
			.then(res => res[0]);
	});


export {
	updateFurniture,
	UpdateFurnitureScheme
};
