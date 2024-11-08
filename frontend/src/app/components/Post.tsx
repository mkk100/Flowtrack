import type { PostSchema } from "../interface";

const Post = (post: PostSchema) => {
  return (
    <div>
      <div key={post.id}>
        <h2>{post.description}</h2>
        <p>Level: {post.level}</p>
        <p>Duration: {post.duration} minutes</p>
      </div>
    </div>
  );
};

export default Post;
