import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import { faUsers, faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Group } from "@mantine/core";
import Link from "next/link";
import classes from "./HeaderSearch.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function RightMenu() {
  const { user } = useUser();
  const [userName, setUserName] = useState(null);
  const { signOut } = useClerk();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/users/" + user?.username
        );
        setUserName(response.data.username);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user?.username) {
      fetchUserName();
    }
  });
  return (
    <Group className={classes.visibleFromSm}>
      <ClerkLoading>
        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <div className="flex items-center justify-between gap-10">
            <div className="cursor-pointer">
              <Link href={"/friends"}>
                <FontAwesomeIcon icon={faUsers} />
              </Link>
            </div>
            <div className="cursor-pointer">
              <FontAwesomeIcon icon={faBell} />
            </div>
            {user && user.imageUrl ? (
              <Link href={"/profile/" + userName}>
                <Image
                  loader={() => user.imageUrl}
                  src={user.imageUrl}
                  alt="User Avatar"
                  className="rounded-full"
                  width={32}
                  height={32}
                />
              </Link>
            ) : (
              <Link href={"/profile/" + userName}>
                <FontAwesomeIcon icon={faUser} />
              </Link>
            )}
          </div>
          <button onClick={() => signOut({ redirectUrl: "/" })}>
            Sign out
          </button>
        </SignedIn>
        <SignedOut>
          <div>
            <Link href="/sign-in">
              <Button variant="default" mr={10}>
                Log in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="filled">Register</Button>
            </Link>
          </div>
        </SignedOut>
      </ClerkLoaded>
    </Group>
  );
}
