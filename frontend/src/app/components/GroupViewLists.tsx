import axios from "axios";
import { useEffect, useState } from "react";
import { Groups } from "../interface";
import { Button, Modal } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { useUser } from "@clerk/nextjs";

export default function GroupViewLists() {
  const [groups, setGroups] = useState<Groups[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const {user} = useUser();
  
  const handleRowClick = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };
  const handleJoinGroup = async (groupId: string) => {
    await axios.post(`http://localhost:4000/groups/${groupId}/memberships`,{
        userName: user?.username
    })
    close();
    handleRowClick(groupId);
  };
  useEffect(() => {
    axios.get("http://localhost:4000/groups").then((response) => {
      setGroups(response.data);
    });
  });

  return (
    <div className="pt-8">
      <div className="flex flex-col space-y-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="cursor-auto flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div
              className="text-lg font-semibold text-black cursor-pointer hover:text-gray-500"
              onClick={() => handleRowClick(group.id)}
            >
              {group.name}
            </div>
            <div className="text-gray-600">{group.description}</div>
            <div className="text-sm text-gray-500">
              {group.memberships.length} members
            </div>
            <Modal
              opened={opened}
              onClose={close}
              title="Are you sure you want to join this group?"
              centered
            >
              <div className="flex justify-end space-x-4">
                <Button color="black" onClick={() => handleJoinGroup(group.id)}>Yes</Button>
                <Button color="red" onClick={close}>
                  No
                </Button>
              </div>
            </Modal>
            <Button
              color="black"
              onClick={() => {
                open();
              }}
            >
              Join
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
