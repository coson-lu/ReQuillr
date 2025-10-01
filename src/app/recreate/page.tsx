"use client";

import React, { useEffect, useRef, useState } from "react";
import { pickPassage, PickResult } from '@/lib/passagePicker';
import textsJSON from '../../../public/texts.json';
import RewriteScene from "./rewrite";
import CompareScene from "./compare";
import DoneScene from "./done";
import { useRouter } from 'next/navigation';

type LogEntry = {
  passage: PickResult;
  author: string;
  title: string;
  curScene: number;
  scenes: string[];
};

export default function Home() {
  const router = useRouter();

  const [passage, setPassage] = useState<PickResult | undefined>(undefined);
  const [author, setAuthor] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [scene, setScene] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    const storedData = JSON.parse(localStorage.getItem('log')) as LogEntry[] || [];
    const last = storedData.at(-1);


    switch (last.curScene) {
      case 2:
        setScene("rewrite");
        setProgress(0.5);
        setAuthor(last.author || "");
        setTitle(last.title || "");
        setPassage(last.passage);
        break;
      case 3:
        setScene("compare");
        setProgress(10);
        setAuthor(last.author || "");
        setTitle(last.title || "");
        setPassage(last.passage);
        break;
      case 0:
      case 1:
      default:
        router.replace('/');
        break;
    }

    if (last.passage) setPassage(last.passage);
    if (last.author) setAuthor(last.author);
    if (last.title) setTitle(last.title);
  }, [router]);

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

