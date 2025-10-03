"use client";

import React, { useEffect, useRef, useState } from "react";
import RewriteScene from "./rewrite";
import CompareScene from "./compare";
import DoneScene from "./done";
import { useRouter } from 'next/navigation';
import { useLogStore, LogEntry } from "@/stores/useLogStores";

export default function Home() {
  const router = useRouter();

  const [scene, setScene] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  const logs = useLogStore((s) => s.logs);

  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    const storedData = logs as LogEntry[] || [];
    const last = storedData.at(-1);

    switch (last.curScene) {
      case 2:
        setScene("rewrite");
        setProgress(0.5);
        break;
      case 3:
        setScene("compare");
        setProgress(10);
        break;
      case 0:
      case 1:
      default:
        router.replace('/');
        break;
    }
  }, [logs, router]);

  return (
    <div className="">
      <div className="absolute top-[1.5vh] left-1/2 -translate-x-1/2 font-header flex flex-col items-center gap-1.5">
        <h1 className="">Recreate</h1>
        <div className="relative w-[20vw] h-0.75 outline outline-[#111] rounded-md">
          <div
            className="absolute top-0 bottom-0 left-[-1px] h-0.75 rounded-md bg-[#111] transition-all duration-150"
            style={{ width: `calc(${progress}vw + 2px)` }}
          />
        </div>
      </div>
      {scene === 'rewrite' && <RewriteScene
        onContinue={() => {
          setScene('compare');
          setProgress(10);
        }}
      />}
      {scene === 'compare' && <CompareScene
        onContinue={() => {
          setScene('done');
          setProgress(20);
        }}
      />}
      {scene === 'done' && <DoneScene />}
    </div>
  );
}

