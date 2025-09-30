"use client";

import React, { useEffect, useRef, useState } from "react";
import textsJSON from '../../../public/texts.json'
import PassageViewPars from "@/components/PassageViewPars";
import { PickResult } from "@/lib/passagePicker";

interface CopyProps {
  onContinue: () => void;
  passage: PickResult;
  title: string;
  author: string;
}

type LogEntry = {
  passage: PickResult | null;
  author: string;
  title: string;
  curScene: number;
  scenes: string[];
};

export default function CopyScene({ onContinue, passage, title, author }: CopyProps) {
  const [copyWorkText, setCopyWorkText] = useState<string>("");
  const [canType, setCanType] = useState<boolean>(false);

  const [highlightHtml, setHighlightHtml] = useState<string>("");
  const highlightRef = useRef<HTMLDivElement>(null);

  const passageRef = useRef<HTMLDivElement>(null);
  const passageHintRef = useRef<HTMLDivElement>(null);
  const copyWorkRef = useRef<HTMLDivElement>(null);
  const copyHintRef = useRef<HTMLDivElement>(null);
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('log');
      if (storedData) {
        const parsed = JSON.parse(storedData) as LogEntry[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const last = parsed.at(-1);
          if (last?.scenes && typeof last.scenes[0] === 'string') {
            setCopyWorkText(last.scenes[0]);
            setHighlightHtml(buildHighlights(last.scenes[0], passage?.passage ?? ""));

            if (last.scenes[0] === passage?.passage) {
              continueButtonRef.current?.classList.remove("hidden");
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }, [passage]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    function handleTabDown(event: any) {
      if (event.key == 'Escape') {
        if (!canType) { // copyworking
          textAreaRef.current?.focus();
          copyWorkRef.current?.classList.remove('blur-md');
          copyHintRef.current?.classList.add('hidden');
          passageRef.current?.classList.add('blur-md');
          passageHintRef.current?.classList.remove('hidden');
        } else { // reading
          copyWorkRef.current?.blur();
          copyWorkRef.current?.classList.add('blur-md');
          copyHintRef.current?.classList.remove('hidden');
          passageRef.current?.classList.remove('blur-md');
          passageHintRef.current?.classList.add('hidden');
        }
        setCanType(prev => !prev);
      }
    }

    document.addEventListener('keydown', handleTabDown);
    return () => {
      document.removeEventListener('keydown', handleTabDown);
    }
  }, [canType])

  function escapeHtml(s: string) {
    return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' } as any)[c]);
  }

  function buildHighlights(typed: string, target: string) {
    let out = "";
    for (let i = 0; i < typed.length; i++) {
      const ch = typed[i];
      const expected = target?.[i] ?? "";
      const token = ch === "\n" ? "<br/>" : (escapeHtml(ch) || "&nbsp;");
      if (ch !== expected) {
        out += `<span class="bg-red-300/60">${token}</span>`;
      } else {
        out += `<span>${token}</span>`;
      }
    }
    return out;
  }

  function handleCopyChange(event: React.ChangeEvent<any>) {
    event.preventDefault();
    const newVal = event.target.value;
    setCopyWorkText(newVal);
    setHighlightHtml(buildHighlights(newVal, passage?.passage ?? ""));

    try {
      const storedData = localStorage.getItem('log');
      if (storedData) {
        const log = JSON.parse(storedData) as LogEntry[];
        if (log.length > 0) {
          const lastIndex = log.length - 1;
          log[lastIndex].scenes[0] = newVal;
          localStorage.setItem('log', JSON.stringify(log));
        }
      }
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }

    if (newVal === passage?.passage) {
      continueButtonRef.current?.classList.remove("hidden");
    }
  }

  function handleKeyPressed(event: any) {
    if (event.key.length > 1) {
      return;
    }
    if (canType == false) {
      event.preventDefault();
    }
  }

  return (
    <div className="">
      <div className="animate-fade-in absolute top-[11vh] font-mono left-1/2 -translate-x-1/2">
        <p>type the passage verbatim to study phrasing...</p>
      </div>
      <div className="w-dvw h-dvh flex justify-center align-middle items-center animate-fade-in">
        <div className="flex flex-row items-center justify-center gap-[7.5vw] w-[85vw] h-[70vh] ">
          <div className="w-[50%] h-[100%] relative">
            <div
              ref={passageRef}
              className="w-[100%] h-[100%] pl-10 pr-7 py-5 shadow-sm font-header text-[#111] bg-white/90 border border-black/5 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100/0 [&::-webkit-scrollbar-thumb]:bg-accent transition transition-discrete"
            >
              <PassageViewPars result={passage} />
            </div>
            <p
              ref={passageHintRef}
              className="hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-center w-[100%] transition transition-discrete duration-10"
            >
              Press [Escape] to continue reading...
            </p>
          </div>

          <div className="w-[50%] h-[100%] relative">
            <div
              className="blur-md w-[100%] h-[100%] relative"
              ref={copyWorkRef}
            >
              <div
                ref={highlightRef}
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none whitespace-pre-wrap text-transparent font-header leading-normal tracking-normal [&::-webkit-scrollbar]:w-2 pl-10 pr-7 py-5 shadow-sm bg-white/90 border border-black/5 overflow-y-scroll [&::-webkit-scrollbar-track]:bg-gray-100/0 [&::-webkit-scrollbar-thumb]:bg-accent transition transition-discrete"
                dangerouslySetInnerHTML={{ __html: highlightHtml }}
              />

              <textarea
                ref={textAreaRef}
                placeholder="Copy the passage here..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onChange={handleCopyChange}
                onKeyPress={handleKeyPressed}
                // onPaste={(e) => e.preventDefault()}
                value={copyWorkText}
                className="resize-none focus:outline-none h-[100%] w-[100%]  pl-10 pr-7 py-5 shadow-sm font-header text-[#111] bg-transparent border border-black/5 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100/0 [&::-webkit-scrollbar-thumb]:bg-accent relative z-10"
                onScroll={(e) => {
                  if (highlightRef.current) {
                    highlightRef.current.scrollTop = (e.target as HTMLTextAreaElement).scrollTop;
                  }
                }}
              />


            </div>
            <p
              ref={copyHintRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-center w-[100%] transition transition-discrete duration-10"
            >
              Press [Escape] to begin copying...
            </p>
          </div>
        </div>
      </div>
      <div className="animate-fade-in absolute top-[87vh] text-sm font-header left-1/2 -translate-x-1/2">
        <p>(Excerpt from <i>{title}</i> by {author})</p>
      </div>
      <button
        ref={continueButtonRef}
        onClick={() => {
          const storedData = localStorage.getItem('log');
          if (storedData) {
            const log = JSON.parse(storedData) as LogEntry[];
            if (log.length > 0) {
              const lastIndex = log.length - 1;
              log[lastIndex].curScene += 1;
              localStorage.setItem('log', JSON.stringify(log));
            }
          }
          onContinue();
        }}
        className="hidden cursor-pointer absolute right-[10vh] bottom-[5vh] px-5 py-3 rounded-md shadow-sm font-header font-semibold text-[#111] bg-white/90 border border-black/5 transition hover:-translate-y-1 hover:shadow-md"
      >
        continue...
      </button>
    </div>
  );
}
