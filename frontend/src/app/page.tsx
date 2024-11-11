"use client";
import { PostSchema } from "./interface";
import Post from "./components/Post";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Home() {
  const [posts, setPosts] = useState<PostSchema[]>([]);

  useEffect(() => {
    axios.get(`http://localhost:4000/posts/`).then((response) => {
      setPosts(response.data);
    });
  }, []);
  return (
    <div className="flex flex-col items-center pt-8">
      <div
        className="overflow-y-auto h-screen pb-20 pr-4"
        style={{ width: "32rem" }}
      >
        <div className="w-full max-w-2xl">
          {posts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}
