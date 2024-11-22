"use client";
import { PostSchema } from "./interface";
import Post from "./components/Post";
import { useEffect, useState } from "react";
import axios from "axios";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

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
        <div className="flex flex-col items-center justify-center pb-128 overflow-y-auto h-screen pr-4 pt-8">
          <h1 className="text-5xl font-bold mb-4">Welcome to FlowTrack</h1>
          <p className="text-lg mb-8 text-center">
            Connect and share your productivity logs with others.
          </p>

          <div
            className="flex flex-col items-center space-y-8 mt-8 px-4 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            <div className="w-80 h-80 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
              <span className="text-gray-500">Placeholder for Image 1</span>
            </div>
            <p className="text-center max-w-md">
              Here you can explain the first functionality of your app. Describe
              how users can connect and share their productivity logs.
            </p>
            <div className="w-80 h-80 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
              <span className="text-gray-500">Placeholder for Image 2</span>
            </div>
            <p className="text-center max-w-md">
              Here you can explain the second functionality of your app.
              Describe how users can track their progress and stay motivated.
            </p>
            <div className="w-80 h-80 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
              <span className="text-gray-500">Placeholder for Image 3</span>
            </div>
            <p className="text-center max-w-md">
              Here you can explain the third functionality of your app. Describe
              how users can interact with others and share tips.
            </p>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
