"use client";
import { PostSchema } from "./interface";
import Post from "./components/Post";
export default function Home() {
  const mockPosts: PostSchema[] = [
    {
      id: "1",
      userId: "user123",
      description: "This is a sample post about deep work.",
      level: "3",
      duration: 120,
      createdAt: "2024-11-08T12:00:00Z",
      updatedAt: "2023-10-01T12:00:00Z",
      username: "thomas",
      avatar:
        "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yb1BhdG5NRUF2VkRZeFJBdXZqZG1tUzBIMDkifQ",
    },
    {
      id: "2",
      userId: "user456",
      description: "Another post discussing productivity techniques.",
      level: "2",
      duration: 90,
      createdAt: "2023-10-02T14:30:00Z",
      updatedAt: "2023-10-02T14:30:00Z",
      username: "lemon",
      avatar:
        "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yb1BhdG5NRUF2VkRZeFJBdXZqZG1tUzBIMDkifQ",
    },
    {
      id: "3",
      userId: "user789",
      description: "Sharing my experience with time management.",
      level: "4",
      duration: 60,
      createdAt: "2023-10-03T09:15:00Z",
      updatedAt: "2023-10-03T09:15:00Z",
      username: "temu",
      avatar:
        "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yb1BhdG5NRUF2VkRZeFJBdXZqZG1tUzBIMDkifQ",
    },
  ];
  return (
    <div className="flex justify-center items-center mt-12">
      <div className="w-full max-w-2xl">
        {mockPosts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
