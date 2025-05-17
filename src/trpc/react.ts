import { createTRPCContext } from "@trpc/tanstack-react-query";

import type { TRPCRouter } from "@/trpc/root-router";


export const { TRPCProvider, useTRPC } = createTRPCContext<TRPCRouter>();
