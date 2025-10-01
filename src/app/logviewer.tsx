"use client"

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PickResult } from "@/lib/passagePicker";

type LogEntry = {
  passage: PickResult | null;
  author: string;
  title: string;
  curScene: number;
  scenes: string[];
};

export default function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const logData = localStorage.getItem('log');
    if (logData) {
      const parsed = JSON.parse(logData);
      setLogs(parsed);
    }
  }, []);

  return (
    <div className="">
      <div className="flex flex-col gap-4 w-screen h-[90vh] items-center mt-[5vh] overflow-y-scroll">
        {logs.slice().reverse().map((log, index) => (
          <div key={index} className="px-10 py-5 w-[50vw] h-25 rounded-md shadow-sm text-[#111] bg-white/90 border border-black/5 transition-transform transform hover:-translate-y-1 hover:shadow-md">
            {log.author}
            {logs.length - index}
          </div>
        ))}
      </div>
    </div>
  )

}
