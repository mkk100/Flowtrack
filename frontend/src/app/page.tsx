import { Button } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black">
      <Button>
        <Link href="/sign-up">Sign In</Link>
      </Button>
    </div>
  );
}
