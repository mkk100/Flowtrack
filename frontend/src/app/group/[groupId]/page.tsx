"use client";
import { Groups } from "@/app/interface";
import axios from "axios";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
export default function ViewGroup({ params }: { params: { groupId: string } }) {
  const [groupInfo, setGroupInfo] = useState<Groups>();
  const [rowData, setRowData] = useState([
    { field: "Name" },
    { field: "Total Deep Work Time" },
  ]);
  useEffect(() => {
    const fetchData = async () => {
      const info = await axios.get(
        `http://localhost:4000/groups/${params.groupId}`
      );
      setGroupInfo(info.data);
    };
    fetchData();
  }, [params.groupId]);
  return (
    <div>
      <div>{groupInfo?.name}</div>
      <div>{groupInfo?.description}</div>
      <div>{groupInfo?.createdAt}</div>
    </div>
  );
}
