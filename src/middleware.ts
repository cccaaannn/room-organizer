import { registerGlobalMiddleware } from "@tanstack/react-start";

import loggingMiddleware from "@/middlewares/logging-middleware";


registerGlobalMiddleware({
	middleware: [loggingMiddleware]
});
