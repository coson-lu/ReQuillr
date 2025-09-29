"use client";

import React, { useEffect, useState } from "react";
import { pickPassage, PickResult } from '@/lib/passagePicker';
import textsJSON from '../../../public/texts.json'
import CopyScene from "./copy";
import NotesScene from "./notes";
import DoneScene from "./done";

export default function Home() {
  const [passage, setPassage] = useState<PickResult | null>(null);
  const [author, setAuthor] = useState<string | null>("");
  const [title, setTitle] = useState<string | null>("");
  const [scene, setScene] = useState<string>('copy');
  const [progress, setProgress] = useState<number>(0.5);


  function pickRandomBook() {
    useEffect(() => {
      const bookCount = textsJSON.length;
      const randomBookIndex = Math.floor(Math.random() * bookCount);
      const book = textsJSON[randomBookIndex]
      console.log(book["title"])
      console.log(book["author"])
      setAuthor(book["author"])
      setTitle(book["title"])
      setPassage(pickPassage(book["text"], {}))
    }, []);
  }
  pickRandomBook();

  return (
    <div className="">
      <h1 className="absolute top-[1vh] left-1/2 -translate-x-1/2 font-header">Copywork</h1>
      <div className="absolute top-[4vh] left-1/2 -translate-x-1/2">
        <div className="relative w-[20vw] h-0.75 outline outline-[#111] rounded-md">
          <div
            className="absolute top-0 bottom-0 left-[-1px] h-0.75 rounded-md bg-[#111] transition-all duration-150"
            style={{ width: `calc(${progress}vw + 2px)` }}
          />
        </div>
      </div>
      {scene === 'copy' && <CopyScene onContinue={() => { setScene('notes'); setProgress(10) }} passage={passage} author={author} title={title} />}
      {scene === 'notes' && (
        <NotesScene onContinue={() => { setScene('done'); setProgress(20) }} passage={passage} author={author} title={title} />
      )}
      {scene === 'done' && <DoneScene />}
    </div>
  );
}
