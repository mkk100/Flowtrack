"use client";
import { Groups } from "@/app/interface";
import axios from "axios";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef } from "ag-grid-community";
export default function ViewGroup({ params }: { params: { groupId: string } }) {
  const [groupInfo, setGroupInfo] = useState<Groups | null>(null);
  const [colDef, setColDefs] = useState<ColDef[]>([
    { field: "username", headerName: "User Name" },
    { field: "totalMinutes", headerName: "Total Minutes" },
    {
      field: "averageDeepWorkLevel",
      headerName: "Average Deep Work Intensity",
    },
  ]);
  const [rowData, setRowData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await axios.get(
          `http://localhost:4000/groups/${params.groupId}`
        );
        setGroupInfo(info.data);
        const calculations = await axios.get(
          `http://localhost:4000/deepWorkLogs/${params.groupId}`
        );
        setRowData(calculations.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [params.groupId]);
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
