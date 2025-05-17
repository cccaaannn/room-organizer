import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";

import { routeTree } from "@/routeTree.gen";
import TrpcQueryProvider, { queryClient, trpcOptionsProxy } from "@/trpc/trpc-query-provider";
import "@/styles.css";


export const createRouter = () => {
	const router = routerWithQueryClient(
		createTanstackRouter({
			routeTree,
			context: {
				trpc: trpcOptionsProxy,
				queryClient: queryClient
			},
			scrollRestoration: true,
			defaultPreloadStaleTime: 0,

			Wrap: (props: { children: React.ReactNode }) => {
				return (
					<TrpcQueryProvider>
						{props.children}
					</TrpcQueryProvider>
				);
			}
		}),
		queryClient
	);

	return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
