"use client";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Select, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState, useEffect } from "react";

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
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
            color={isActive ? "yellow" : "blue"}
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
        />
        <Select
          label="Deep Work Level"
          placeholder="Pick value"
          data={["1", "2", "3", "4", "5"]}
          style={{ marginBottom: "1rem" }}
        />
        <Button color="blue" fullWidth>
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
      >
        Finish &nbsp;
        <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </div>
  );
};

export default Timer;
