"use client";
import { UserProfile } from "@/app/interface";
import { useUser } from "@clerk/nextjs";
import { Button } from "@mantine/core";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const { username } = params;
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(
    null
  );
  const { user } = useUser();
  const [followerCount, setFollowerCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [followed, setFollowed] = useState(false);
  const [followButton, setFollowButton] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);
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
  const handleUnfollow = async () => {
    try {
      await axios.delete(`http://localhost:4000/users/unfollow`, {
        data: {
          id: currentUser?.id,
          followingId: currentProfile?.id,
        },
      });
      setFollowed(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };
  useEffect(() => {
    const fetchFollower = async () => {
      const response = await axios.get(
        `http://localhost:4000/users/followers/` + currentProfile?.id
      );
      const followers = response.data;
      setFollowerCount(followers["followers"]);
    };
    const fetchFollowing = async () => {
      const response = await axios.get(
        `http://localhost:4000/users/following/` + currentProfile?.id
      );
      const following = response.data;
      setFollowingCount(following["followings"]);
    };
    fetchFollower();
    fetchFollowing();
  }, [currentProfile?.id]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:4000/users/${username}`
      );
      setCurrentProfile(response.data);
      const secondResponse = await axios.get(
        `http://localhost:4000/users/${user?.username}`
      );
      setCurrentUser(secondResponse.data);
    };
    fetchData();
  }, []); // this is not getting executed
  useEffect(() => {
    const fetchData = async () => {
      if (user?.username !== username) {
        const thirdResponse = await axios.get(
          `http://localhost:4000/users/followed/` +
            user?.username +
            `/` +
            username
        );
        setFollowed(thirdResponse.data["isFollowing"]);
        setFollowButton(true);
      } else {
        setFollowButton(false);
      }
    };
    fetchData();
  }, [followed]);

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
              <div className="font-bold">{followingCount}</div>following
            </div>
            <div>
              <div className="font-bold">{followerCount}</div> followers
            </div>
          </div>
        </div>
      </div>
      <div>Deep Work Logs</div>

      {followButton &&
        (followed ? (
          <Button variant="outline" onClick={handleUnfollow}>
            Followed
          </Button>
        ) : (
          <Button onClick={handleFollow}>Follow</Button>
        ))}
    </div>
  );
};

export default ProfilePage;
