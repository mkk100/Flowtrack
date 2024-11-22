"use client";
import { PostSchema } from "./interface";
import Post from "./components/Post";
import { useEffect, useState } from "react";
import axios from "axios";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { LandingPage } from "./components/LandingPage";

export default function Home() {
  const [posts, setPosts] = useState<PostSchema[]>([]);
  const { user } = useUser();
  useEffect(() => {
    if (!user) return;
    axios
      .get(`http://localhost:4000/posts/${user?.username}`)
      .then((response) => {
        setPosts(response.data);
      });
  }, [user, user?.username]);
  return (
    <div>
      <SignedIn>
        <div className="flex flex-col items-center pt-8">
          <div
            className="overflow-y-auto h-screen pb-20 pr-4"
            style={{ width: "32rem" }}
          >
            <div className="w-full max-w-2xl">
              {posts
                .slice()
                .reverse()
                .map((post) => (
                  <Post key={post.id} {...post} />
                ))}
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col items-center justify-center h-screen pb-32">
          <h1 className="text-4xl font-bold mb-8">Welcome to FlowTrack</h1>
          <div className="w-full max-w-4xl p-8">
            <LandingPage />
          </div>
          <div className="absolute bottom-0 left-0 w-full py-4 bg-gray-100 text-center">
            <h2 className="text-sm font-bold mb-2">Contact Us</h2>
            <p className="text-xs mb-2">
              If you have any questions or suggestions, feel free to reach out to us at:
            </p>
            <a
              href="mailto:support@flowtrack.com"
              className="text-blue-500 text-xs"
            >
              support@flowtrack.com
            </a>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
