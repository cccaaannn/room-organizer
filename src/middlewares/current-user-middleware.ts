import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";

import { getSession } from "@/lib/auth-client";


const currentUserMiddleware = createMiddleware().server(
	async ({ next }) => {
		const { data: session } = await getSession({
			fetchOptions: {
				headers: getHeaders() as HeadersInit
			}
		});

		if (!session || !session.user) {
			throw new Error("User session not found");
		}

		return next({
			context: {
				user: {
					id: session.user.id,
					email: session.user.email,
					name: session.user.name
				}
			}
		});
	}
);

const getCurrentUser = createServerFn({ method: "GET", response: "full" })
	.middleware([currentUserMiddleware])
	.handler(async ctx => {
		const { user } = ctx.context;

		if (!user) {
			throw new Error("User not found in context");
		}

		return {
			user
		};
	});

export {
	currentUserMiddleware,
	getCurrentUser
};
