import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { ToastContainer } from "react-toastify";

// eslint-disable-next-line import/no-unresolved
import appCss from "@/styles.css?url";

import AppLayout from "@/components/layout/app-layout/app-layout";
import { ThemeProvider } from "@/components/shadcn/hooks/theme/theme-provider";
import ModalProvider from "@/hooks/useModal/modal-provider";
import type { TRPCRouter } from "@/trpc/root-router";


interface MyRouterContext {
	queryClient: QueryClient;
	trpc: TRPCOptionsProxy<TRPCRouter>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Room organizer" }
		],
		links: [
			{ rel: "stylesheet", href: appCss }
		]
	}),

	component: () => (
		<RootDocument>
			<ThemeProvider defaultTheme="dark" storageKey="app-theme">
				<ModalProvider options={{ closeOnClickOutside: false }}>
					<AppLayout>
						<Outlet />
					</AppLayout>
				</ModalProvider>
			</ThemeProvider>

			<ToastContainer />

			<TanStackRouterDevtools />
		</RootDocument>
	)
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>

			<body>
				{children}

				<Scripts />
			</body>
		</html>
	);
}
