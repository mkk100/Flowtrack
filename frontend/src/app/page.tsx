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
    <div className="flex justify-center items-center mt-12">
      <div className="w-full max-w-2xl">
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
