import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson, { deserialize, serialize } from "superjson";

import { TRPCProvider } from "@/trpc/react";
import type { TRPCRouter } from "@/trpc/root-router";


const getUrl = () => {
	const base = (() => {
		if (typeof window !== "undefined") return "";
		return `http://localhost:${process.env.PORT ?? 3000}`;
	})();
	return `${base}/api/trpc`;
};

const trpcClient = createTRPCClient<TRPCRouter>({
	links: [
		httpBatchStreamLink({
			transformer: superjson,
			url: getUrl()
		})
	]
});

export const queryClient = new QueryClient({
	defaultOptions: {
		dehydrate: { serializeData: serialize },
		hydrate: { deserializeData: deserialize }
	}
});

export const trpcOptionsProxy = createTRPCOptionsProxy({
	client: trpcClient,
	queryClient: queryClient
});

const TrpcQueryProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{children}
			</TRPCProvider>

			<ReactQueryDevtools buttonPosition="bottom-right" />
		</>
	);
};

export default TrpcQueryProvider;
