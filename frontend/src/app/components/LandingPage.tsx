import {
  IconBook,
  IconFrustum,
  IconUserCheck,
  IconUsersGroup,
} from "@tabler/icons-react";
import {
  Button,
  Grid,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import classes from "./FeaturesTitle.module.css";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: IconBook,
    title: "Tracking",
    description:
      "Track all of your deep work sessions with our built-in timer.",
  },
  {
    icon: IconUsersGroup,
    title: "Join and Create Groups",
    description:
      "Join various groups and check the leaderboards for weekly champions.",
  },
  {
    icon: IconUserCheck,
    title: "Follower/Following System",
    description:
      "Follow your friends and colleagues to see their deep work logs and their progress.",
  },
  {
    icon: IconFrustum,
    title: "Tentative Future Features",
    description: "Deep Work Logs analytics",
  },
];

export function LandingPage() {
  const router = useRouter();
  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="md"
        variant="gradient"
        gradient={{ deg: 133, from: "black", to: "black" }}
      >
        <feature.icon size={26} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <div className={classes.wrapper}>
      <Grid gutter={80}>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Title className={classes.title} order={2}>
            Social Platform for Knowledge Workers
          </Title>
          <Text c="dimmed">
            Track your deep work sessions, create and join groups to see how you
            measure up against your friends and your group members.
          </Text>

          <Button
            variant="gradient"
            gradient={{ deg: 133, from: "black", to: "black" }}
            size="lg"
            radius="md"
            mt="xl"
            component="a"
            onClick={() => router.push("/sign-in")}
          >
            Get started
          </Button>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
            {items}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </div>
  );
}
