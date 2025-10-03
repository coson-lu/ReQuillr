"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLogStore, type LogEntry } from "@/stores/useLogStores";

export default function Home() {
  const [processStage, setProcessStage] = useState<string>("");

  const logs = useLogStore((s) => s.logs);

  useEffect(() => {
    const storedData = (logs as LogEntry[]) || [];
    const last = storedData.at(-1);
    if (!last || last.curScene < 2) {
      setProcessStage("copywork");
    } else {
      setProcessStage("recreate");
    }
  }, [logs]);

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex gap-5 absolute w-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {processStage === "copywork" &&
            <Link
              type='button'
              href='/copywork'
              className="px-10 py-5 rounded-md shadow-sm font-header font-semibold text-xl tracking-wide text-[#111] bg-white/90 border border-black/5 transition-transform transform hover:-translate-y-1 hover:shadow-md"
            >
              Copywork
            </Link>
          }
          {processStage === "recreate" &&
            <Link
              type='button'
              href='/recreate'
              className="px-10 py-5 rounded-md shadow-sm font-header font-semibold text-xl tracking-wide text-[#111] bg-white/90 border border-black/5 transition-transform transform hover:-translate-y-1 hover:shadow-md"
            >
              Recreate
            </Link>
          }
        </div>
        <p className="font-light text-center absolute left-1/2 -translate-x-1/2 top-[calc(50%+4rem)] w-auto hover:underline underline-offset-2 hover:cursor-pointer">What&apos;s this?</p>
      </div>
    </div>
  );
}

