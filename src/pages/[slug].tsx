import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";

import { api } from "y/utils/api";
import Image from "next/image";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const ProfilePage: NextPage<{ userId: string }> = ({ userId }) => {
  const { data } = api.profile.getUserByUserId.useQuery({
    userId,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.id}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profilePicture}
            alt={`${data.id}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data.id}`}</div>
        <div className="border-slate w-full border-b"></div>
      </PageLayout>
    </>
  );
};

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { prisma } from "y/server/db";
import superjson from "superjson";
import { appRouter } from "y/server/api/root";
import { PageLayout } from "y/components/layout";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const userId = slug.replace("@", "");

  await ssg.profile.getUserByUserId.prefetch({ userId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      userId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
