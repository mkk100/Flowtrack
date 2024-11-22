import type { PostSchema } from "../interface";
import Image from "next/image";

const Post = (post: PostSchema) => {
  const createdAtDate = new Date(post.createdAt);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const displayDate = () => {
    if (createdAtDate.toDateString() === today.toDateString()) {
      return `Today at ${createdAtDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (createdAtDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${createdAtDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return (
        createdAtDate.toLocaleDateString([], {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) +
        ` at ` +
        createdAtDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  };
  return (
    <div className="flex justify-center">
      <div className="border rounded-lg shadow-md p-4 mb-5 bg-white w-full max-w-lg">
        <div key={post.id} className="flex items-start">
          <Image
            loader={() => post.user.avatar}
            src={post.user.avatar}
            alt="User Avatar"
            className="rounded-full mr-4"
            width={48}
            height={48}
          />
          <div>
            <h1 className="font-bold text-lg">{post.user.username}</h1>
            <p className="text-gray-600 text-sm">Level: {post.deepWorkLevel}</p>
            <p className="text-gray-600 text-sm">
              Duration: {post.deepWorkDuration} minutes
            </p>
            <p className="text-gray-600 text-sm">{displayDate()}</p>
            <h2 className="mt-2 text-gray-800">{post.description}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
