import { createServerFn } from "@tanstack/react-start";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { rooms } from "@/db/schema";


const UpdateRoomScheme = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, { message: "Name is required" }).max(250, { message: "Name must be less than 250 characters" }),
	description: z.string().max(1000, { message: "Description must be less than 500 characters" })
});

const updateRoom = createServerFn({ method: "POST", response: "full" })
	.validator(room => UpdateRoomScheme.parse(room))
	.handler(async ctx => {
		const entity = await db.select()
			.from(rooms)
			.where(eq(rooms.id, ctx.data.id));

		if (entity.length === 0) {
			throw new Error("Not found");
		}

		if (entity[0].name !== ctx.data.name) {
			const existingTag = await db.select()
				.from(rooms)
				.where(eq(rooms.name, ctx.data.name));

			if (existingTag.length > 0) {
				throw new Error("Name is in use");
			}
		}

		return await db.update(rooms)
			.set({
				name: ctx.data.name,
				description: ctx.data.description,
				updatedAt: sql`NOW()`
			})
			.where(eq(rooms.id, ctx.data.id))
			.returning()
			.then(res => res[0]);
	});


export {
	updateRoom,
	UpdateRoomScheme
};
