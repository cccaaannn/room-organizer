import { createTRPCRouter } from "@/trpc/init";
import { roomRouter } from "@/trpc/routes/room-router";


export const trpcRouter = createTRPCRouter({
	room: roomRouter
});
export type TRPCRouter = typeof trpcRouter;
