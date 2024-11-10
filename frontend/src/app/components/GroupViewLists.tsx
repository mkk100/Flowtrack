import axios from "axios";
import { useEffect, useState } from "react";
import { Groups } from "../interface";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function GroupViewLists() {
  const [groups, setGroups] = useState<Groups[]>([]);
  const router = useRouter();

  const handleRowClick = (groupId: string) => {
    router.push(`/group/${groupId}`);
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
            onClick={() => handleRowClick(group.id)}
          >
            <div className="text-lg font-semibold">{group.name}</div>
            <div className="text-gray-600">{group.description}</div>
            <div className="text-sm text-gray-500">
              {group.memberships.length} members
            </div>
            <Button color="black">Join</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
