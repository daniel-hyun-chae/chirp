import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { prisma } from "y/server/db";
import superjson from "superjson";
import { appRouter } from "y/server/api/root";

export const generateSSGHelper = () => {
  return createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });
};
