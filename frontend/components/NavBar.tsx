"use client";
import { Autocomplete, Group, Burger, rem, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import classes from "./HeaderSearch.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsToEye,
  faBell,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  useClerk,
} from "@clerk/nextjs";
const links = [
  { link: "/about", label: "Home" },
  { link: "/pricing", label: "Track" },
  { link: "/learn", label: "Groups" },
];

export function NavBar() {
  const [opened, { toggle }] = useDisclosure(false);
  const { signOut } = useClerk();
  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <Button>
            <FontAwesomeIcon icon={faArrowsToEye} />
            <Link href="/">&nbsp;&nbsp;Flowtrac</Link>
          </Button>
        </Group>

        <Group>
          <Group ml={50} gap={46} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
          <Autocomplete
            className={classes.search}
            placeholder="Search"
            leftSection={
              <IconSearch
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            data={[
              "React",
              "Angular",
              "Vue",
              "Next.js",
              "Riot.js",
              "Svelte",
              "Blitz.js",
            ]}
            visibleFrom="xs"
          />
        </Group>
        <Group className={classes.visibleFromSm}>
          <ClerkLoading>
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedIn>
              <div className="cursor-pointer">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="cursor-pointer">
                <FontAwesomeIcon icon={faBell} />
              </div>
              <Button onClick={() => signOut({ redirectUrl: "/" })}>
                Sign out
              </Button>
            </SignedIn>
            <SignedOut>
              <div className="flex items-center gap-2 text-sm">
                <Link href="/sign-in">Login/Register</Link>
              </div>
            </SignedOut>
          </ClerkLoaded>
        </Group>
      </div>
    </header>
  );
}
