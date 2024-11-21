"use client";
import { DeepWorkLogs, UserProfile } from "@/app/interface";
import { useUser } from "@clerk/nextjs";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Divider, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const { username } = params;
  const [opened, { open, close }] = useDisclosure(false);
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
  }, [currentProfile?.id, followed, user?.username, username]);

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
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/deepWorkLogs/${id}`);
      setDeepWorkLogs((prev) => prev?.filter((log) => log.id !== id));
    } catch (error) {
      console.error("Error deleting log:", error);
    }
    close();
  };
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
              <span className="font-bold">{deepWorkLogs?.length} </span> logs
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
        <div className="overflow-x-auto pb-20 pr-4">
          <div className="flex gap-4">
            {deepWorkLogs?.map((log) => (
              <Card
                key={log.id}
                shadow="md"
                padding="xl"
                radius="lg"
                withBorder
                className="bg-gray-50 hover:shadow-lg transition-shadow duration-300 min-w-[300px]"
              >
                <div className="flex justify-between ">
                  <div className="text-lg font-semibold text-gray-800 mb-3">
                    {log.description}
                  </div>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    onClick={open}
                    className="cursor-pointer"
                  />{" "}
                  <Modal
                    opened={opened}
                    onClose={close}
                    title=" Are you sure you want to delete this log?"
                    centered
                  >
                    <div className="flex justify-end space-x-4">
                      <Button color="red" onClick={() => handleDelete(log.id)}>
                        Delete
                      </Button>
                      <Button color="black" onClick={close}>
                        Cancel
                      </Button>
                    </div>
                  </Modal>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
