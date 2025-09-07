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
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Room organizer" },
			{ property: "og:url", content: "https://cccaaannn.github.io/room-organizer" },
			{ property: "og:type", content: "website" },
			{ property: "og:title", content: "Room organizer" },
			{ property: "og:description", content: "Organize your items" },
			{ property: "og:image", content: "https://raw.githubusercontent.com/cccaaannn/room-organizer/master/public/image/icon-500x500.png" },
			{ name: "twitter:card", content: "summary_large_image" },
			{ property: "twitter:domain", content: "cccaaannn.github.io" },
			{ property: "twitter:url", content: "https://cccaaannn.github.io/room-organizer" },
			{ name: "twitter:title", content: "Room organizer" },
			{ name: "twitter:description", content: "Organize your items" },
			{ name: "twitter:image", content: "https://raw.githubusercontent.com/cccaaannn/room-organizer/master/public/image/icon-500x500.png" }
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
