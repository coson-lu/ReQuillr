"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLogStore } from "@/stores/useLogStores";

interface CopyProps {
  onContinue: () => void;
}

export default function CopyScene({ onContinue }: CopyProps) {
  const [copyWorkText, setCopyWorkText] = useState<string>("");
  const [canType, setCanType] = useState<boolean>(false);

  const [highlightHtml, setHighlightHtml] = useState<string>("");
  const highlightRef = useRef<HTMLDivElement>(null);

  const passageRef = useRef<HTMLDivElement>(null);
  const passageHintRef = useRef<HTMLDivElement>(null);
  const copyWorkRef = useRef<HTMLDivElement>(null);
  const copyHintRef = useRef<HTMLDivElement>(null);
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  const logs = useLogStore((s) => s.logs);
  const updateLastLogField = useLogStore((s) => s.updateLastLogField);

  const latest = logs.at(-1);

  useEffect(() => {
    try {
      if (latest && Array.isArray(latest.scenes) && latest.scenes.length > 0) {
        const firstScene = latest.scenes[0] ?? "";
        const target = latest.passage?.passage ?? "";
        setCopyWorkText(firstScene);
        setHighlightHtml(buildHighlights(firstScene, target));

        if (firstScene === target) {
          continueButtonRef.current?.classList.remove("hidden");
        }
      }
    } catch (error) {
      console.error("Failed to initialize from store:", error);
    }
  }, [logs, buildHighlights, latest]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    function handleTabDown(event: React.KeyboardEvent) {
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
    return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' } as Record<string, string>)[c]);
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

  function handleCopyChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    const newVal = event.target.value;
    const target = latest?.passage?.passage ?? "";

    setCopyWorkText(newVal);
    setHighlightHtml(buildHighlights(newVal, target));

    if (latest) {
      const nextScenes = [...(latest.scenes ?? [])];
      nextScenes[0] = newVal;
      updateLastLogField('scenes', nextScenes);
    }

    if (newVal === target) {
      continueButtonRef.current?.classList.remove("hidden");
    }
  }

  function handleKeyPressed(event: React.KeyboardEvent) {
    if (event.key.length > 1) {
      return;
    }
    if (canType == false) {
      event.preventDefault();
    }
  }

  return (
    <div className="">
      <div className="animate-fade-in absolute top-[11vh] w-dvw text-center font-mono left-1/2 -translate-x-1/2">
        <p>type the passage verbatim to study phrasing...</p>
      </div>
      <div className="w-dvw h-dvh flex justify-center align-middle items-center animate-fade-in">
        <div className="flex flex-row items-center justify-center gap-[7.5vw] w-[85vw] h-[70vh] ">
          <div className="w-[50%] h-[100%] relative">
            <div
              ref={passageRef}
              className="w-[100%] h-[100%] pl-10 pr-7 py-5 shadow-sm font-header whitespace-pre-line text-[#111] bg-white/90 border border-black/5 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100/0 [&::-webkit-scrollbar-thumb]:bg-accent transition transition-discrete"
            >
              <p>{latest?.passage?.passage}</p>
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
        <p>(Excerpt from <i>{latest?.title}</i> by {latest?.author})</p>
      </div>
      <button
        ref={continueButtonRef}
        onClick={() => {
          if (latest) {
            updateLastLogField('curScene', (latest.curScene + 1));
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

