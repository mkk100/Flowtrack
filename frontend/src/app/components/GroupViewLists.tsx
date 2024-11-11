import axios from "axios";
import { useEffect, useState } from "react";
import { GroupResponse } from "../interface";
import { Button, Modal, Tabs } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { useUser } from "@clerk/nextjs";

export default function GroupViewLists() {
  const [joinedGroups, setJoinedGroups] = useState<GroupResponse[]>([]);
  const [unjoinedGroups, setUnjoinedGroups] = useState<GroupResponse[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const { user } = useUser();

  const handleRowClick = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };
  const handleJoinGroup = async (groupId: string) => {
    await axios.post(`http://localhost:4000/groups/${groupId}/memberships`, {
      userName: user?.username,
    });
    close();
    handleRowClick(groupId);
  };
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (user) {
          const response = await axios.get(
            `http://localhost:4000/users/${user.username}/groups`
          );
          setJoinedGroups(response.data);

          const response2 = await axios.get(
            `http://localhost:4000/users/${user.username}/available-groups`
          );
          setUnjoinedGroups(response2.data);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, [user]);

  return (
    <div className="pt-8">
      <Tabs defaultValue="joined" color="black">
        <Tabs.List>
          <Tabs.Tab value="joined">Joined Groups</Tabs.Tab>
          <Tabs.Tab value="theRest">Groups To Join</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="joined">
          <div className="flex flex-col space-y-4 pt-4">
            {joinedGroups.map((group) => (
              <div
                key={group.groupId}
                className="cursor-auto flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex-1">
                  <div
                    className="text-lg font-semibold text-black cursor-pointer hover:text-gray-500"
                    onClick={() => handleRowClick(group.groupId)}
                  >
                    {group.group.name}
                  </div>
                  <div className="text-gray-600">{group.group.description}</div>
                </div>
                <div className="text-sm text-gray-500 pr-16">
                  {group.group._count.memberships} members
                </div>
                <Modal
                  opened={opened}
                  onClose={close}
                  title="Are you sure you want to join this group?"
                  centered
                >
                  <div className="flex justify-end space-x-4">
                    <Button
                      color="black"
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      Yes
                    </Button>
                    <Button color="red" onClick={close}>
                      No
                    </Button>
                  </div>
                </Modal>
              </div>
            ))}
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="theRest">
          <div className="flex flex-col space-y-4 pt-4">
            {unjoinedGroups.length === 0 ? (
              <div className="text-center text-gray-600">
                You have joined every group
              </div>
            ) : (
              unjoinedGroups.map((group) => (
                <div
                  key={group.id}
                  className="cursor-auto flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex-1">
                    <div
                      className="text-lg font-semibold text-black cursor-pointer hover:text-gray-500"
                      onClick={() => handleRowClick(group.id)}
                    >
                      {group.name}
                    </div>
                    <div className="text-gray-600">{group.description}</div>
                  </div>
                  <div className="text-sm text-gray-500 pr-16">
                    {group._count.memberships} members
                  </div>
                  <Button
                    color="black"
                    onClick={() => {
                      open();
                    }}
                  >
                    Join
                  </Button>
                  <Modal
                    opened={opened}
                    onClose={close}
                    title="Are you sure you want to join this group?"
                    centered
                  >
                    <div className="flex justify-end space-x-4">
                      <Button
                        color="black"
                        onClick={() => {
                          console.log(group.id);
                          handleJoinGroup(group.id);
                        }}
                      >
                        Yes
                      </Button>
                      <Button color="red" onClick={close}>
                        No
                      </Button>
                    </div>
                  </Modal>
                </div>
              ))
            )}
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
