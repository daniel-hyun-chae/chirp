import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

import { api, type RouterOutputs } from "y/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const SinglePostView: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div>Post View</div>
      </main>
    </>
  );
};

export default SinglePostView;
