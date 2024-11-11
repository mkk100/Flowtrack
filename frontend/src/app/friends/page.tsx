"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserProfile } from "../interface";
import Link from "next/link";
import { Card, Image } from "@mantine/core";

export default function FriendsPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  useEffect(() => {
    axios.get("http://localhost:4000/users").then((response) => {
      setUsers(response.data);
    });
  }, []);
  return (
    <div
      style={{
        maxHeight: "100vh",
        overflowY: "auto",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Suggested</h1>
      <div
        className="flex gap-10"
        style={{ flexWrap: "wrap", justifyContent: "center" }}
      >
        {users.map((user: UserProfile) => (
          <Card
            key={user.id}
            shadow="sm"
            radius="md"
            withBorder
            w={200}
            style={{ width: "150px", backgroundColor: "#fff" }}
          >
            <Card.Section className="p-4">
              <Image
                src={user.avatar}
                alt="User Avatar"
                radius="xl"
                height={80}
                width={80}
                style={{
                  margin: "10px auto",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Card.Section>
            <Link
              href={"/profile/" + user.username}
              className="block text-center mt-2 font-bold text-black hover:text-gray-500"
            >
              {user.username}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
