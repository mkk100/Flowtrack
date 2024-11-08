"use client";
import { Group, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderSearch.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsToEye } from "@fortawesome/free-solid-svg-icons";
import RightMenu from "./RightMenu";
const links = [
  { link: "/", label: "Dashboard" },
  { link: "/track", label: "Track" },
  { link: "/group", label: "Groups" },
];

export function NavBar() {
  const [opened, { toggle }] = useDisclosure(false);
  const items = links.map((link) => (
    <Link key={link.label} href={link.link} className={classes.link}>
      {link.label}
    </Link>
  ));

  return (
    // menu at the right that includes the user profile and sign out
    <header className={classes.header + " item-center" + " pb-2 pt-2"}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <div className={classes.logo}>
            <FontAwesomeIcon icon={faArrowsToEye} />
            <Link href="/">&nbsp;&nbsp;Flowtrack</Link>
          </div>
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
