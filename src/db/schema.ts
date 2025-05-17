import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";


const timestamps = {
	updatedAt: timestamp("updated_at"),
	createdAt: timestamp("created_at").defaultNow().notNull()
};

const baseEntity = {
	id: uuid("id").defaultRandom().primaryKey(),
	...timestamps
};

export const rooms = pgTable("rooms", {
	...baseEntity,
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description").notNull()
});

export const roomsRelations = relations(rooms, ({ many }) => ({
	furniture: many(furniture)
}));

export const furniture = pgTable("furniture", {
	...baseEntity,
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description").notNull(),
	roomId: uuid("room_id").notNull().references(() => rooms.id)
});

export const furnitureRelations = relations(furniture, ({ one }) => ({
	room: one(rooms, {
		fields: [furniture.roomId],
		references: [rooms.id]
	})
}));

export const sections = pgTable("sections", {
	...baseEntity,
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description").notNull(),
	furnitureId: uuid("furniture_id").notNull()
});

export const sectionsRelations = relations(sections, ({ one }) => ({
	furniture: one(furniture, {
		fields: [sections.furnitureId],
		references: [furniture.id]
	})
}));

export const tags = pgTable("tags", {
	...baseEntity,
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description").notNull(),
	color: varchar("color", { length: 255 }).notNull()
});

export const tagsRelations = relations(tags, ({ many }) => ({
	itemsTags: many(itemsTags)
}));

export const items = pgTable("items", {
	...baseEntity,
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description").notNull(),
	sectionId: uuid("section_id").notNull().references(() => sections.id)
});

export const itemsRelations = relations(items, ({ one, many }) => ({
	section: one(sections, {
		fields: [items.sectionId],
		references: [sections.id]
	}),
	itemsTags: many(itemsTags),
	relatedItems: many(relatedItems, { relationName: "item" })
}));

export const itemsTags = pgTable("items_tags", {
	itemId: uuid("item_id")
		.notNull()
		.references(() => items.id),
	tagId: uuid("tag_id")
		.notNull()
		.references(() => tags.id)
}, t => [primaryKey({ columns: [t.itemId, t.tagId] })]
);

export const itemsTagsRelations = relations(itemsTags, ({ one }) => ({
	item: one(items, {
		fields: [itemsTags.itemId],
		references: [items.id]
	}),
	tag: one(tags, {
		fields: [itemsTags.tagId],
		references: [tags.id]
	})
}));

export const relatedItems = pgTable("related_items", {
	itemId: uuid("item_id")
		.notNull()
		.references(() => items.id),
	relatedItemId: uuid("related_item_id")
		.notNull()
		.references(() => items.id)
}, t => [primaryKey({ columns: [t.itemId, t.relatedItemId] })]
);

export const relatedItemsRelations = relations(relatedItems, ({ one }) => ({
	item: one(items, {
		fields: [relatedItems.itemId],
		references: [items.id],
		relationName: "item"
	}),
	relatedItem: one(items, {
		fields: [relatedItems.relatedItemId],
		references: [items.id],
		relationName: "relatedItem"
	})
}));

