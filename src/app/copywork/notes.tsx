"use client";

import React, { useRef, useState } from "react";
import PassageViewPars from "@/components/PassageViewPars";
import { PickResult } from "@/lib/passagePicker";

interface NotesProps {
  onContinue: () => void;
  passage: PickResult;
  title: string;
  author: string;
}

export default function NotesScene({ onContinue, passage, title, author }: NotesProps) {
  const [notesText, setNotesText] = useState<string>("");
  const passageRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);


  function handleNotesChange(event: React.ChangeEvent<any>) {
    event.preventDefault();
    setNotesText(event.target.value);
  }

  return (
    <div className="">
      <div className="animate-fade-in absolute top-[11vh] font-mono left-1/2 -translate-x-1/2">
        <p>write short notes/hints for each sentence (20–30 chars)...</p>
      </div>
      <div className="w-dvw h-dvh flex justify-center align-middle items-center animate-fade-in">
        <div className="flex flex-row items-center justify-center gap-[7.5vw] w-[85vw] h-[70vh] ">
          <div
            ref={passageRef}
            className="w-[50%] h-[100%] pl-10 pr-7 py-5 shadow-sm font-header text-[#111] bg-white/90 border border-black/5 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100/0 [&::-webkit-scrollbar-thumb]:bg-accent transition transition-discrete"
          >
            <PassageViewPars result={passage} />
          </div>
          <textarea
            ref={notesRef}
            placeholder="Take notes on the passage here..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onChange={handleNotesChange}
            value={notesText}
            className="resize-none focus:outline-none w-[50%] h-[100%] pl-10 pr-7 py-5 shadow-sm font-header text-[#111] bg-white/90 border border-black/5 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100/0 [&::-webkit-scrollbar-thumb]:bg-accent"
          />
        </div>
      </div>
      <div className="animate-fade-in absolute top-[87vh] text-sm font-header left-1/2 -translate-x-1/2">
        <p>(Excerpt from <i>{title}</i> by {author})</p>
      </div>
      <button onClick={onContinue} className="cursor-pointer absolute right-[10vh] bottom-[5vh] px-5 py-3 rounded-md shadow-sm font-header font-semibold text-[#111] bg-white/90 border border-black/5 transition hover:-translate-y-1 hover:shadow-md">finish!</button>
    </div>
  );
}


