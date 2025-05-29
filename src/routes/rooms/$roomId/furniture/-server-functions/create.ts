import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { furniture } from "@/db/schema";


const CreateFurnitureScheme = z.object({
	roomId: z.string().uuid(),
	name: z.string().min(1, { message: "Name is required" }).max(250, { message: "Name must be less than 250 characters" }),
	description: z.string().max(1000, { message: "Description must be less than 500 characters" })
});

const createFurniture = createServerFn({ method: "POST", response: "full" })
	.validator(f => CreateFurnitureScheme.parse(f))
	.handler(async ctx => {
		const entity: typeof furniture.$inferInsert = {
			name: ctx.data.name,
			description: ctx.data.description,
			roomId: ctx.data.roomId
		};

		const existingEntity = await db.select()
			.from(furniture)
			.where(and(eq(furniture.name, ctx.data.name), eq(furniture.roomId, ctx.data.roomId)));

		if (existingEntity.length > 0) {
			throw new Error("Name is in use");
		}

		return await db.insert(furniture)
			.values(entity)
			.returning()
			.then(res => res[0]);
	});


export {
	createFurniture,
	CreateFurnitureScheme
};
