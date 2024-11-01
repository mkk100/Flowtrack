"use client";
import { UserProfile } from "@/app/interface";
import { Button } from "@mantine/core";
import axios from "axios";
import Image from "next/image";
import { useMemo, useState } from "react";

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const { username } = params;
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(
    null
  );
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [followed, setFollowed] = useState(false);

  const handleFollow = async () => {
    try {
      await axios.post(
        `http://localhost:4000/users/follow`,
        {
          id: currentUser?.id,
          followingId: currentProfile?.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFollowed(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };
  const handleUnfollow = async () => {};
  useMemo(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:4000/users/${username}`
      );
      setCurrentProfile(response.data);
      const secondResponse = await axios.get(
        `http://localhost:4000/users/${username}`
      );
      setCurrentUser(secondResponse.data);
    };

    fetchData();
  }, [username]); // this is not getting executed

  if (!currentProfile) {
    return <div>Loading...</div>;
  }
  return (
    <div className="pl-12">
      <div className="flex pt-8 items-center">
        <Image
          loader={() => currentProfile.avatar}
          src={currentProfile.avatar}
          alt="User Avatar"
          className="rounded-full"
          width={150}
          height={150}
        />
        <div className="pl-16">
          <div className="text-2xl capitalize pb-4">
            {currentProfile.username}
          </div>
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
      {followed ? (
        <Button variant="outline" onClick={handleUnfollow}>
          Followed
        </Button>
      ) : (
        <Button onClick={handleFollow}>Follow</Button>
      )}
    </div>
  );
};

export default ProfilePage;
