"use client";
import { UserProfile } from "@/app/interface";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

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
    <div className="pl-12">
      <div className="flex pt-8 items-center">
        <Image
          loader={() => data.avatar}
          src={data.avatar}
          alt="User Avatar"
          className="rounded-full"
          width={150}
          height={150}
        />
        <div className="pl-16">
          <div className="text-2xl capitalize pb-4">{data.username}</div>
          <div className="flex justify-between gap-8 text-base">
            <div>
              <div className="font-bold">6</div> logs
            </div>
            <div>
              <div className="font-bold">15</div> following
            </div>
            <div>
              <div className="font-bold">300</div> followers
            </div>
          </div>
        </div>
      </div>
      <div>Deep Work Logs</div>
    </div>
  );
};

export default ProfilePage;
