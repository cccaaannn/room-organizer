import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { tags } from "@/db/schema";
import V from "@/utils/validation";


const CreateTagScheme = z.object({
	name: z.string().min(1, { message: "Name is required" }).max(250, { message: "Name must be less than 250 characters" }),
	description: z.string().max(1000, { message: "Description must be less than 500 characters" }),
	color: z.string().max(250, { message: "Name must be less than 250 characters" }).refine(V.isColor, { message: "Color must be a valid hex color" })
});

const createTag = createServerFn({ method: "POST", response: "full" })
	.validator(f => CreateTagScheme.parse(f))
	.handler(async ctx => {
		const entity: typeof tags.$inferInsert = {
			name: ctx.data.name,
			description: ctx.data.description,
			color: ctx.data.color
		};

		const existingEntity = await db.select()
			.from(tags)
			.where(eq(tags.name, ctx.data.name));

		if (existingEntity.length > 0) {
			throw new Error("Name is in use");
		}

		return await db.insert(tags)
			.values(entity)
			.returning()
			.then(res => res[0]);
	});


export {
	createTag,
	CreateTagScheme
};
