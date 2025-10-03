"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLogStore, type LogEntry } from "@/stores/useLogStores";

interface RewriteProps {
  onContinue: () => void;
}

export default function RewriteScene({ onContinue }: RewriteProps) {
  const [rewriteText, setRewriteText] = useState<string>("");
  const passageRef = useRef<HTMLDivElement>(null);
  const rewriteRef = useRef<HTMLTextAreaElement>(null);

  const logs = useLogStore((s) => s.logs);
  const updateLastLogField = useLogStore((s) => s.updateLastLogField);

  const latest = logs.at(-1) as LogEntry | undefined;

  useEffect(() => {
    try {
      if (latest?.scenes && typeof latest.scenes[2] === "string") {
        setRewriteText(latest.scenes[2]);
      }
    } catch (error) {
      console.error('Failed to load from store:', error);
    }
  }, [latest]);

  function handleNotesChange(event: React.ChangeEvent<any>) {
    event.preventDefault();
    const newVal = event.target.value;
    setRewriteText(newVal);

    try {
      if (latest) {
        const nextScenes = [...(latest.scenes ?? [])];
        nextScenes[2] = newVal;
        updateLastLogField("scenes", nextScenes as any);
      }
    } catch (error) {
      console.error('Failed to save to store:', error);
    }
  }

  return (
    <div className="">
      <div className="animate-fade-in absolute top-[11vh] w-dvw text-center font-mono left-1/2 -translate-x-1/2">
        <p>recreate the passage from your short hints...</p>
      </div>
      <div className="w-dvw h-dvh flex justify-center align-middle items-center animate-fade-in">
        <div className="flex flex-row items-center justify-center gap-[7.5vw] w-[85vw] h-[70vh] ">
          <div
            ref={passageRef}
            className="w-[50%] h-[100%] pl-10 pr-7 py-5 shadow-sm font-header text-[#111] whitespace-pre-line bg-white/90 border border-black/5 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100/0 [&::-webkit-scrollbar-thumb]:bg-accent transition transition-discrete"
          >
            {latest?.scenes?.[1]}
          </div>
          <textarea
            ref={rewriteRef}
            placeholder="Rewrite here..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onChange={handleNotesChange}
            value={rewriteText}
            className="resize-none focus:outline-none w-[50%] h-[100%] pl-10 pr-7 py-5 shadow-sm font-header text-[#111] bg-white/90 border border-black/5 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100/0 [&::-webkit-scrollbar-thumb]:bg-accent"
          />
        </div>
      </div>
      <div className="animate-fade-in absolute top-[87vh] text-sm font-header left-1/2 -translate-x-1/2">
        <p>(Excerpt from <i>{latest?.title}</i> by {latest?.author})</p>
      </div>
      <button
        onClick={() => {
          if (latest) {
            useLogStore.getState().updateLastLogField("curScene", (latest.curScene + 1) as any);
          }
          onContinue();
        }}
        className="cursor-pointer absolute right-[10vh] bottom-[5vh] px-5 py-3 rounded-md shadow-sm font-header font-semibold text-[#111] bg-white/90 border border-black/5 transition hover:-translate-y-1 hover:shadow-md"
      >
        finish!
      </button>
    </div>
  );
}

