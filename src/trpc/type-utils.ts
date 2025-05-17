import type { inferRouterOutputs } from "@trpc/server";

import type { TRPCRouter } from "@/trpc/root-router";
import type { Unpacked } from "@/utils/typescript";


type RouterOutput = inferRouterOutputs<TRPCRouter>;

export type FromTrpcValue<TRouter extends keyof RouterOutput, TFn extends keyof RouterOutput[TRouter]> = RouterOutput[TRouter][TFn];
export type FromTrpcArrayValue<TRouter extends keyof RouterOutput, TFn extends keyof RouterOutput[TRouter]> = Unpacked<RouterOutput[TRouter][TFn]>;
