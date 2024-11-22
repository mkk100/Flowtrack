"use client";
import {
  DeepWorkLogs,
  Follower,
  Following,
  UserProfile,
} from "@/app/interface";
import { useUser } from "@clerk/nextjs";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Divider, Modal, Select, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const { username } = params;
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [openedFollower, { open: openFollower, close: closeFollower }] =
    useDisclosure(false);
  const [openedFollowing, { open: openFollowing, close: closeFollowing }] =
    useDisclosure(false);
  const [
    openedDeleteAccount,
    { open: openDeleteAccount, close: closeDeleteAccount },
  ] = useDisclosure(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(
    null
  );
  const router = useRouter();
  const { user } = useUser();
  const [isOwner, setIsOwner] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [follower, setFollower] = useState<Follower[] | null>(null);
  const [following, setFollowing] = useState<Following[] | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [followed, setFollowed] = useState(false);
  const [followButton, setFollowButton] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);
  const [deepWorkLogs, setDeepWorkLogs] = useState<DeepWorkLogs[]>();
  const handleDeleteAccount = async () => {
    try {
      //await axios.delete(`http://localhost:4000/users/${user?.username}`);
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
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
  const editLogs = async (id: string, description: string, level: string) => {
    try {
      await axios.put(`http://localhost:4000/deepWorkLogs/${id}`, {
        description: description,
        deepWorkLevel: level,
      });
    } catch (error) {
      console.error("Error editing log:", error);
    }
    closeEdit();
  };
  useEffect(() => {
    const fetchFollower = async () => {
      const response = await axios.get(
        `http://localhost:4000/users/followers/` + currentProfile?.id
      );
      const followers = response.data;
      setFollowerCount(followers["followers"].length);
      setFollower(followers["followers"]);
    };
    const fetchFollowing = async () => {
      const response = await axios.get(
        `http://localhost:4000/users/following/` + currentProfile?.id
      );
      const following = response.data;
      setFollowingCount(following["followings"].length);
      setFollowing(following["followings"]);
    };

    const fetchDeepWorkLogs = async () => {
      const response = await axios.get(
        `http://localhost:4000/users/${username}/deepWorkLogs`
      );
      setDeepWorkLogs(response.data);
    };
    const checkOwner = async () => {
      if (currentUser?.id === currentProfile?.id) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    };
    if (currentProfile?.id && user?.username) {
      fetchFollower();
      fetchFollowing();
      fetchDeepWorkLogs();
      checkOwner();
    }
  }, [currentProfile?.id, currentUser?.id, followed, user?.username, username]);

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
  const handleUrl = (profileName: string) => {
    router.push(`/profile/${profileName}`);
  };
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
          <div className="text-2xl pb-4 flex gap-4">
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
          <div className="flex gap-12 text-base">
            <div>
              <span className="font-bold">
                {deepWorkLogs?.length}&nbsp;logs
              </span>
            </div>
            <div>
              <div onClick={openFollowing}>
                <span className="font-bold">
                  {followingCount}&nbsp;following
                </span>
              </div>
            </div>
            <Modal
              opened={openedFollowing}
              onClose={closeFollowing}
              title="Following"
              centered
              size="sm"
              className="max-w-4 max-h-4"
            >
              <div className="flex flex-col gap-4">
                <div className="overflow-x-auto">
                  {following?.map((followingPerson) => (
                    <div
                      key={
                        followingPerson.followingId + followingPerson.username
                      }
                      className="flex-shrink-0 flex items-center space-x-2 mb-4"
                    >
                      <Image
                        loader={() => followingPerson.avatar}
                        src={followingPerson.avatar}
                        alt="User Avatar"
                        className="rounded-full"
                        width={50}
                        height={50}
                      />
                      <div
                        onClick={() => handleUrl(followingPerson.username)}
                        className="cursor-pointer"
                      >
                        {followingPerson.username}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Modal>
            <div>
              <div onClick={openFollower}>
                <span className="font-bold">
                  {followerCount}&nbsp;followers
                </span>
              </div>
            </div>
            <Modal
              opened={openedFollower}
              onClose={closeFollower}
              title="Followers"
              centered
              size="sm"
            >
              <div className="flex flex-col gap-4">
                <div className="overflow-x-auto">
                  {follower?.map((follower) => (
                    <div
                      key={follower.followerId + follower.username}
                      className="flex-shrink-0 flex items-center space-x-2 mb-4"
                    >
                      <Image
                        loader={() => follower.avatar}
                        src={follower.avatar}
                        alt="User Avatar"
                        className="rounded-full"
                        width={50}
                        height={50}
                      />
                      <div
                        onClick={() => handleUrl(follower.username)}
                        className="cursor-pointer"
                      >
                        {follower.username}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Modal>
          </div>
        </div>
        <div className="flex justify-end w-full">
          {isOwner && (
            <div className="mr-12">
              <Button onClick={openDeleteAccount} className="h-8" color="red">
                Delete Account
              </Button>
              <Modal
                opened={openedDeleteAccount}
                onClose={closeDeleteAccount}
                title="Are you sure you want to delete your account?"
                centered
              >
                <div className="flex justify-end space-x-4">
                  <Button color="red" onClick={handleDeleteAccount}>
                    Delete
                  </Button>
                  <Button color="black" onClick={closeDeleteAccount}>
                    Cancel
                  </Button>
                </div>
              </Modal>
            </div>
          )}
        </div>
      </div>
      <Divider className="w-11/12" />
      <div className="mt-8">
        <div className="text-xl font-bold mb-4">Deep Work Logs</div>
        <div className="overflow-x-auto pb-20 pr-4">
          <div className="flex gap-4">
            {deepWorkLogs
              ?.slice()
              .reverse()
              .map((log) => (
                <Card
                  key={log.id}
                  shadow="md"
                  padding="xl"
                  radius="lg"
                  withBorder
                  className="bg-gray-50 hover:shadow-lg transition-shadow duration-300 min-w-[300px]"
                >
                  <div className="flex justify-between max-h-32">
                    <div className="text-lg font-semibold text-gray-800 mb-3 break-words">
                      <div onClick={openEdit} className="max-w-48">
                        {log.description}
                      </div>
                    </div>
                    <Modal
                      opened={openedEdit && isOwner}
                      onClose={closeEdit}
                      title="Edit Log"
                      centered
                    >
                      <div className="space-y-4">
                        <TextInput
                          label="Title"
                          placeholder="Edit Description"
                          required
                          className="mb-4"
                          defaultValue={log.description}
                          onChange={(event) =>
                            (log.description = event.currentTarget.value)
                          }
                        />
                        <Select
                          label="Deep Work Level"
                          placeholder="Pick value"
                          data={["1", "2", "3", "4", "5"]}
                          style={{ marginBottom: "1rem" }}
                          onChange={(value) => {
                            log.deepWorkLevel = value
                              ? parseInt(value)
                              : log.deepWorkLevel;
                          }}
                          required
                          defaultValue={log.deepWorkLevel.toString()}
                        />
                      </div>
                      <div className="flex justify-end space-x-4 mt-6">
                        <Button
                          color="black"
                          onClick={() =>
                            editLogs(
                              log.id,
                              log.description,
                              log.deepWorkLevel.toString()
                            )
                          }
                        >
                          Save
                        </Button>
                        <Button color="gray" onClick={closeEdit}>
                          Cancel
                        </Button>
                      </div>
                    </Modal>
                    {isOwner && (
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        onClick={open}
                        className="cursor-pointer"
                      />
                    )}
                    <Modal
                      opened={opened}
                      onClose={close}
                      title=" Are you sure you want to delete this log?"
                      centered
                    >
                      <div className="flex justify-end space-x-4">
                        <Button
                          color="red"
                          onClick={() => handleDelete(log.id)}
                        >
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
                    {new Date(log.logDate).toLocaleDateString()},{" "}
                    {new Date(log.logDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
