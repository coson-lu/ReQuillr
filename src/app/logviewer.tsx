"use client"

import React, { useEffect, useRef } from "react";
import { useLogStore } from "@/stores/useLogStores";

export default function LogViewer() {
  const logs = useLogStore((s) => s.logs);


  return (
    <div className="">
      <div
        className="mask-t-from-50% mask-b-from-50% flex flex-col w-screen h-[90vh] items-center mt-[5vh] overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100/0"
      >
        {logs.slice().reverse().map((log, index) => (
          <div
            key={index}
            className="px-10 py-5 my-2 w-[50vw] h-25 rounded-md shadow-sm text-[#111] bg-white/90 border border-black/5 transition-transform transform hover:-translate-y-1 hover:shadow-md"
          >
            {log.author}
            {logs.length - index}
          </div>
        ))}
      </div>
    </div>
  )

}
