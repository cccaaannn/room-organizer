import { createTRPCRouter } from "@/trpc/init";
import { furnitureRouter } from "@/trpc/routes/furniture-router";
import { itemRouter } from "@/trpc/routes/item-router";
import { roomRouter } from "@/trpc/routes/room-router";
import { sectionRouter } from "@/trpc/routes/section-router";
import { tagRouter } from "@/trpc/routes/tag-router";


export const trpcRouter = createTRPCRouter({
	room: roomRouter,
	furniture: furnitureRouter,
	section: sectionRouter,
	item: itemRouter,
	tag: tagRouter
});
export type TRPCRouter = typeof trpcRouter;
