import { createAPIFileRoute } from "@tanstack/react-start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createContext } from "@/trpc/init";
import { trpcRouter } from "@/trpc/root-router";


function handler({ request }: { request: Request }) {
	return fetchRequestHandler({
		req: request,
		router: trpcRouter,
		endpoint: "/api/trpc",
		createContext: async opts => {
			return createContext({
				...opts,
				req: request,
				res: undefined
			});
		}
	});
}

export const APIRoute = createAPIFileRoute("/api/trpc/$")({
	GET: handler,
	POST: handler
});
