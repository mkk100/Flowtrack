"use client";
import { useUser } from "@clerk/nextjs";
import { Button, Modal, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { useState } from "react";
import GroupViewLists from "../components/GroupViewLists";
import { useRouter } from "next/navigation";

const GroupPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [groupName, setGroupName] = useState("Group 1");
  const router = useRouter();
  const [groupDescription, setGroupDescription] = useState("Group");
  const { user } = useUser();
  const createGroup = async () => {
    try {
      const response = await axios.post(`${process.env.BACKEND_URL}/groups`, {
        groupName: groupName,
        groupDescription: groupDescription,
        user: user?.username,
      });
      router.push(`/group/${response.data.group.id}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="pt-6 p-32 overflow-y-auto h-screen pb-16">
      <div className="flex justify-between">
        <div className="font-bold">Groups</div>
        <Modal opened={opened} onClose={close} title="Create a group" centered>
          <TextInput
            label="Group Name"
            placeholder="Deep Work Group"
            style={{ marginBottom: "1rem" }}
            required
            maxLength={50}
            onChange={(event) => setGroupName(event.currentTarget.value)}
          />
          <Textarea
            label="Group Description"
            placeholder="A group for deep work sessions"
            maxLength={50}
            required
            className="mb-4"
            onChange={(event) => setGroupDescription(event.currentTarget.value)}
          />
          <Button
            color="black"
            onClick={() => {
              createGroup();
              alert("Group created!");
              close();
            }}
            fullWidth
          >
            Create
          </Button>
        </Modal>
        <Button
          color="black"
          onClick={() => {
            open();
          }}
        >
          Create a group
        </Button>
      </div>
      <GroupViewLists />
    </div>
  );
};
export default GroupPage;
