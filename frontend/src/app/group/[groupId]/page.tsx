"use client";
import { Groups } from "@/app/interface";
import axios from "axios";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef } from "ag-grid-community";
import { useUser } from "@clerk/nextjs";
import { Button, Modal } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
export default function ViewGroup({ params }: { params: { groupId: string } }) {
  const [groupInfo, setGroupInfo] = useState<Groups | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const [colDef] = useState<ColDef[]>([
    { field: "username", headerName: "User Name" },
    { field: "totalMinutes", headerName: "Total Minutes" },
    {
      field: "averageDeepWorkLevel",
      headerName: "Average Deep Work Intensity",
    },
  ]);
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [rowData, setRowData] = useState([]);
  const deleteGroup = async () => {
    await axios.delete(`http://localhost:4000/groups/${params.groupId}`);
    router.push(`/group`);
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const info = await axios.get(
          `http://localhost:4000/groups/${params.groupId}`
        );
        setGroupInfo(info.data);
        const calculations = await axios.get(
          `http://localhost:4000/deepWorkLogs/${params.groupId}`
        );
        setRowData(calculations.data);
        const response = await axios.get(
          `http://localhost:4000/users/${user?.username}/isAdmin`
        );
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [params.groupId, user, user?.username]);
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333", textAlign: "center" }}>
        {groupInfo?.name} Leaderboard
      </h1>
      <p style={{ color: "#666", textAlign: "center" }}>
        {groupInfo?.description}
      </p>
      <p style={{ color: "#999", textAlign: "center" }}>
        Since &nbsp;
        {groupInfo?.createdAt
          ? new Date(groupInfo.createdAt).toLocaleDateString()
          : "N/A"}
      </p>
      {isAdmin && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <Button color="red" onClick={open}>
            Delete
          </Button>
          <Modal
            opened={opened}
            onClose={close}
            title="Do you want to delete this group?"
            centered
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Button color="red" onClick={deleteGroup}>
                Delete
              </Button>
              <Button color="black" onClick={close}>
                Cancel
              </Button>
            </div>
          </Modal>
        </div>
      )}
      <div
        className="ag-theme-quartz"
        style={{
          height: 400,
          width: "80%",
          margin: "20px auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={colDef}
          domLayout="autoHeight"
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            headerClass: "ag-header-cell",
            cellClass: "ag-cell",
            flex: 1,
          }}
          className="ag-theme-quartz flex-1"
        />
      </div>
    </div>
  );
}
