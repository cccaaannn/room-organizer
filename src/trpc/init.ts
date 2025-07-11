import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";

import { auth } from "@/lib/auth";


export const createContext = async (opts: CreateNextContextOptions) => {
	// Get session from better auth
	const session = await auth.api.getSession({
		headers: opts.req.headers
	});
	return {
		session
	};
};

const t = initTRPC.context<typeof createContext>().create({
	transformer: superjson
});

const logger = t.middleware(async ({ path, type, next }) => {
	console.log(`TRPC Request: ${type} ${path}`);
	const start = Date.now();
	const result = await next();
	console.log(`TRPC Response: ${type} ${path} - ${Date.now() - start}ms`);
	return result;
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
	}
	return next();
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure.use(logger);
export const protectedProcedure = t.procedure.use(logger).use(isAuthed);
