"use client";
import { DeepWorkLogs, UserProfile } from "@/app/interface";
import { useUser } from "@clerk/nextjs";
import { Button, Card, Divider } from "@mantine/core";
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
  const [deepWorkLogs, setDeepWorkLogs] = useState<DeepWorkLogs[]>();
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

    const fetchDeepWorkLogs = async () => {
      const response = await axios.get(
        `http://localhost:4000/users/${username}/deepWorkLogs`
      );
      console.log(response.data);
      setDeepWorkLogs(response.data);
    };

    if (currentProfile?.id && user?.username) {
      fetchFollower();
      fetchFollowing();
      fetchDeepWorkLogs();
    }
  }, [currentProfile?.id, followed, user?.username]);

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
  }, [user?.username, username]); // this is not getting executed
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
  }, [followed, user?.username, username]);

  if (!currentProfile) {
    return <div>Loading...</div>;
  }
  return (
    <div className="pl-12">
      <div className="flex pt-8 items-center pb-6">
        <Image
          loader={() => currentProfile.avatar}
          src={currentProfile.avatar}
          alt="User Avatar"
          className="rounded-full"
          width={150}
          height={150}
        />
        <div className="pl-16">
          <div className="text-2xl capitalize pb-4 flex gap-4">
            <div>{currentProfile.username}</div>
            <div>
              {followButton &&
                (followed ? (
                  <Button
                    variant="outline"
                    onClick={handleUnfollow}
                    className="h-8 w-26"
                    color="black"
                  >
                    Followed
                  </Button>
                ) : (
                  <Button
                    onClick={handleFollow}
                    className="h-8 w-24"
                    color="black"
                  >
                    Follow
                  </Button>
                ))}
            </div>
          </div>
          <div className="flex justify-between gap-8 text-base">
            <div>
              <span className="font-bold">6 </span>logs
            </div>
            <div>
              <span className="font-bold">{followingCount} </span> following
            </div>
            <div>
              <span className="font-bold">{followerCount} </span>followers
            </div>
          </div>
        </div>
      </div>
      <Divider className="w-11/12" />
      <div className="mt-8">
        <div className="text-xl font-bold mb-4">Deep Work Logs</div>
        <div className="overflow-y-auto h-screen pb-20 pr-4">
          {deepWorkLogs?.map((log) => (
            <div
              key={log.id}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border-b border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <Card
                  shadow="md"
                  padding="xl"
                  radius="lg"
                  withBorder
                  className="w-full bg-gray-50 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-lg font-semibold text-gray-800 mb-3">
                    {log.description}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Duration:&nbsp;
                    {log.minutesLogged} minutes
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Deep Work Level: {log.deepWorkLevel}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(log.logDate).toLocaleDateString()}
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
