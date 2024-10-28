"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

interface UserProfile {
  username: string;
  avatar: string;
}

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const { username } = params;
  const [data, setData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:4000/users/${username}`
      );
      setData(response.data);
    };

    fetchData();
  });

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>{data.username}</h1>
      <Image
        loader={() => data.avatar}
        src={data.avatar}
        alt="User Avatar"
        width={100}
        height={100}
      />
    </div>
  );
};

export default ProfilePage;
