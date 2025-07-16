import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { furniture, rooms } from "@/db/schema";
import { currentUserMiddleware } from "@/middlewares/current-user-middleware";


const CreateFurnitureScheme = z.object({
	roomId: z.string().uuid(),
	name: z.string().min(1, { message: "Name is required" }).max(250, { message: "Name must be less than 250 characters" }),
	description: z.string().max(1000, { message: "Description must be less than 500 characters" })
});

const createFurniture = createServerFn({ method: "POST", response: "full" })
	.validator(f => CreateFurnitureScheme.parse(f))
	.middleware([currentUserMiddleware])
	.handler(async ctx => {
		const existingRoom = await db.select()
			.from(rooms)
			.where(and(
				eq(rooms.id, ctx.data.roomId),
				eq(rooms.userId, ctx.context.user.id)
			));

		if (existingRoom.length === 0) {
			throw new Error("Room not found");
		}

		const entity: typeof furniture.$inferInsert = {
			name: ctx.data.name,
			description: ctx.data.description,
			roomId: ctx.data.roomId,
			userId: ctx.context.user.id
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
