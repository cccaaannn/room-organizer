import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { rooms } from "@/db/schema";
import { currentUserMiddleware } from "@/middlewares/current-user-middleware";


const CreateRoomScheme = z.object({
	name: z.string().min(1, { message: "Name is required" }).max(250, { message: "Name must be less than 250 characters" }),
	description: z.string().max(1000, { message: "Description must be less than 500 characters" })
});

const createRoom = createServerFn({ method: "POST", response: "full" })
	.validator(room => CreateRoomScheme.parse(room))
	.middleware([currentUserMiddleware])
	.handler(async ctx => {
		const entity: typeof rooms.$inferInsert = {
			name: ctx.data.name,
			description: ctx.data.description,
			userId: ctx.context.user.id
		};

		const existingEntity = await db.select()
			.from(rooms)
			.where(eq(rooms.name, ctx.data.name));

		if (existingEntity.length > 0) {
			throw new Error("Name is in use");
		}

		return await db.insert(rooms)
			.values(entity)
			.returning()
			.then(res => res[0]);
	});


export {
	createRoom,
	CreateRoomScheme
};
