import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import { faUsers, faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Group } from "@mantine/core";
import Link from "next/link";
import classes from "./HeaderSearch.module.css";

export default function RightMenu() {
  const { user } = useUser();
  return (
    <Group className={classes.visibleFromSm}>
      <ClerkLoading>
        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <div className="flex items-center justify-between gap-10">
            <div className="cursor-pointer">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="cursor-pointer">
              <FontAwesomeIcon icon={faBell} />
            </div>
            {user && user.imageUrl ? (
              <Link href="/profile">
                <img
                  src={user.imageUrl}
                  alt="User Profile"
                  className="h-8 w-8 rounded-full"
                />
              </Link>
            ) : (
              <Link href="/profile">
                <FontAwesomeIcon icon={faUser} />
              </Link>
            )}
          </div>
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