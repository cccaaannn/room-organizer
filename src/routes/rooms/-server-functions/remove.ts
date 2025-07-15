import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { furniture, rooms } from "@/db/schema";
import { currentUserMiddleware } from "@/middlewares/current-user-middleware";


const RemoveRoomScheme = z.object({
	id: z.string().uuid()
});

const removeRoom = createServerFn({ method: "POST", response: "full" })
	.validator(room => RemoveRoomScheme.parse(room))
	.middleware([currentUserMiddleware])
	.handler(async ctx => {
		const entity = await db.select()
			.from(rooms)
			.where(and(
				eq(rooms.id, ctx.data.id),
				eq(rooms.userId, ctx.context.user.id)
			));

		if (entity.length === 0) {
			throw new Error("Not found");
		}

		const furnitureList = await db.select()
			.from(furniture)
			.where(eq(furniture.roomId, ctx.data.id));

		if (furnitureList.length > 0) {
			throw new Error("Cannot delete room with furniture");
		}

		await db.delete(rooms)
			.where(eq(rooms.id, ctx.data.id));
	});


export {
	removeRoom,
	RemoveRoomScheme
};
