"use client";

import React, { useEffect, useRef, useState } from "react";
import { pickPassage } from '@/lib/passagePicker';
import textsJSON from '../../../public/texts.json';
import CopyScene from "./copy";
import NotesScene from "./notes";
import DoneScene from "./done";
import { useRouter } from 'next/navigation';
import { useLogStore, type LogEntry } from "@/stores/useLogStores";

export default function Home() {
  const router = useRouter();

  const [scene, setScene] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  const logs = useLogStore((s) => s.logs);
  const addLog = useLogStore((s) => s.addLog);

  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    const last = logs.at(-1);

    if (!last || last.curScene === -1) {
      const bookCount = textsJSON.length;
      const randomBookIndex = Math.floor(Math.random() * bookCount);
      const book = textsJSON[randomBookIndex];

      const chosenPassage = pickPassage(book["text"], {});

      const entry: LogEntry = {
        passage: chosenPassage,
        author: book.author,
        title: book.title,
        curScene: 0,
        scenes: ["", "", "", ""],
      };

      addLog(entry);
      setScene('copy');
      setProgress(0.5);
    } else {
      switch (last.curScene) {
        case 0:
          setScene("copy");
          setProgress(0.5);
          break;
        case 1:
          setScene("notes");
          setProgress(10);
          break;
        case 2:
        case 3:
        default:
          router.replace('/');
          break;
      }
    }
  }, [router, addLog, logs]);

  return (
    <div className="">
      <div className="absolute top-[1.5vh] left-1/2 -translate-x-1/2 font-header flex flex-col items-center gap-1.5">
        <h1 className="">Copywork</h1>
        <div className="relative w-[20vw] h-0.75 outline outline-[#111] rounded-md">
          <div
            className="absolute top-0 bottom-0 left-[-1px] h-0.75 rounded-md bg-[#111] transition-all duration-150"
            style={{ width: `calc(${progress}vw + 2px)` }}
          />
        </div>
      </div>
      {scene === 'copy' && <CopyScene
        onContinue={() => {
          setScene('notes');
          setProgress(10);
        }}
      />}
      {scene === 'notes' && <NotesScene
        onContinue={() => {
          setScene('done');
          setProgress(20);
        }}
      />}
      {scene === 'done' && <DoneScene />}
    </div>
  );
}

