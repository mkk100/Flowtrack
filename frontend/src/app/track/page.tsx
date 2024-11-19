"use client";
import { useUser } from "@clerk/nextjs";
import { Button, Modal, Select, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { UserProfile } from "../interface";
import { useNavigationGuard } from "next-navigation-guard";
const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [enabled] = useState(true);
  const [description, setDescription] = useState("Deep Work Session");
  const [level, setLevel] = useState("1");
  const [userId, setUserId] = useState<UserProfile | null>(null);
  const { user } = useUser();
  const navGuard = useNavigationGuard({
    enabled: enabled && isActive,
    confirm: () =>
      window.confirm("Your progress won't be saved. Do you want to leave?"),
  });
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, seconds]);

  useEffect(() => {
    const fetchData = async () => {
      const secondResponse = await axios.get(
        `http://localhost:4000/users/${user?.username}`
      );
      setUserId(secondResponse.data);
    };
    fetchData();
  }, [user?.username]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const submitPost = async () => {
    try {
      const response = await axios.post("http://localhost:4000/posts", {
        userId: userId?.id,
        description: description,
        level: level,
        duration: Math.floor(seconds / 60),
      });
      console.log("Post submitted successfully:", response.data);

      const postId = response.data.id;
      console.log(postId);
      try {
        const response2 = await axios.post(
          "http://localhost:4000/deepWorkLogs",
          {
            userId: userId?.id,
            description: description,
            minutesLogged: Math.floor(seconds / 60),
            deepWorkLevel: level,
            postId: postId,
          }
        );
        console.log("Deep work log submitted successfully:", response2.status);
      } catch (error) {
        console.error("Error submitting deep work log:", error);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
    close();
    reset();
    alert("Post submitted successfully!");
  };

  return (
    <div>
      <div
        className="flex justify-center items-center h-screen flex-col"
        style={{ paddingBottom: "30vh" }}
      >
        <div className="text-center mb-4">
          <div className="time block text-4xl">{formatTime(seconds)}</div>
        </div>
        <div className="space-x-4">
          <Button
            className={`button button-primary button-primary-${
              isActive ? "active" : "inactive"
            }`}
            onClick={toggle}
            color={isActive ? "yellow" : "black"}
          >
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button className="button" onClick={reset} color="red">
            Reset
          </Button>
        </div>
      </div>

      <Modal opened={opened} onClose={close} title="Post" centered>
        <TextInput
          label="Description"
          placeholder="Deep Work Session #1"
          style={{ marginBottom: "1rem" }}
          onChange={(event) => setDescription(event.currentTarget.value)}
          required
        />
        <Select
          label="Deep Work Level"
          placeholder="Pick value"
          data={["1", "2", "3", "4", "5"]}
          style={{ marginBottom: "1rem" }}
          onChange={(value) => {
            setLevel(value !== null ? value : "1");
          }}
          required
        />
        <Button
          color="black"
          onClick={() => {
            if (seconds >= 2) {
              submitPost();
            } else {
              alert("Session must be at least 1 minute long to post.");
            }
          }}
          fullWidth
        >
          Post
        </Button>
      </Modal>
      <Button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
        onClick={() => {
          setIsActive(false);
          open();
        }}
        color="black"
      >
        Finish
      </Button>
      {navGuard.active && (
        <Modal
          opened={navGuard.active}
          onClose={close}
          title="Are you sure you want to leave?"
          centered
        >
          <div className="flex justify-end space-x-4">
            <Button color="black" onClick={navGuard.accept}>
              Yes
            </Button>
            <Button color="red" onClick={navGuard.reject}>
              No
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Timer;
