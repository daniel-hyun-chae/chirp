import { type NextPage } from "next";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

import { api } from "y/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner } from "y/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "y/components/layout";
import { PostView } from "y/components/postview";
dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState<string>("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  if (!user) return null;
  return (
    <div className="flex w-full items-center gap-3">
      <Image
        width={50}
        height={50}
        src={user.profileImageUrl}
        alt="Profile image"
        className="rounded-full"
      />
      <input
        placeholder="Type some emojis!"
        className="px- grow bg-transparent outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
      />
      {input !== "" && !isPosting && (
        <button
          onClick={() => {
            mutate({ content: input });
          }}
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: isPostLoading } = api.posts.getAll.useQuery();

  if (isPostLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;
  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  // Start fetching early
  api.posts.getAll.useQuery();
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  if (!userLoaded) return <div></div>;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {isSignedIn && <CreatePostWizard />}
        {isSignedIn && <SignOutButton />}
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
