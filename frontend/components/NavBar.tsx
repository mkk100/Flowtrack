"use client";
import { Autocomplete, Group, Burger, rem, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import classes from "./HeaderSearch.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsToEye } from "@fortawesome/free-solid-svg-icons";
const links = [
  { link: "/about", label: "Home" },
  { link: "/pricing", label: "Track" },
  { link: "/learn", label: "Groups" },
];

export function NavBar() {
  const [opened, { toggle }] = useDisclosure(false);

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
        <Group visibleFrom="sm">
          <Button variant="default">Register</Button>
          <Button>
            <Link href="/sign-up">Sign In</Link>
          </Button>
          <Button>hi</Button>
        </Group>
      </div>
    </header>
  );
}
