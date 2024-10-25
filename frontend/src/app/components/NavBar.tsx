"use client";
import { Group, Burger, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderSearch.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsToEye } from "@fortawesome/free-solid-svg-icons";
import RightMenu from "./RightMenu";
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
    // menu at the right that includes the user profile and sign out
    <header className={classes.header + " item-center"}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <Button>
            <FontAwesomeIcon icon={faArrowsToEye} />
            <Link href="/">&nbsp;&nbsp;Flowtrack</Link>
          </Button>
        </Group>
        <Group>
          <Group ml={50} gap={46} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
        </Group>
        <RightMenu />
      </div>
    </header>
  );
}
