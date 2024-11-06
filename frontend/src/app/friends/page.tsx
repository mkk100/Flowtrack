"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserProfile } from "../interface";
import Link from "next/link";

export default function FriendsPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  useEffect(() => {
    axios.get("http://localhost:4000/users").then((response) => {
      setUsers(response.data);
    });
  }, []);
  return (
    <div>
      <h1>Friends</h1>
      <ul>
        {users.map((user: UserProfile) => (
          <Link key={user.id} href={"/profile/" + user.username}>
            {user.username}
          </Link>
        ))}
      </ul>
    </div>
  );
}
