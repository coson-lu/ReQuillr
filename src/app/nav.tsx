"use client"

import React, { useEffect, useRef, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { BsJournal } from "react-icons/bs";
import Link from "next/link";
import HeaderButton from "@/components/headerButton";
import Settings from "./settings";
import LogViewer from "./logviewer";

export default function Nav() {
  return (
    <nav className="absolute top-0 left-0 right-0 flex flex-row justify-between w-4/5 m-auto text-center h-[6vh]">
      <div className="border-red-100 flex items-center">
        <Link href='/' className="font-header text-3xl text-center">ReQuillr</Link>
      </div>
      <div className="flex flex-row gap-9 items-center">
        <HeaderButton
          buttonIcon={IoSettingsOutline}
          content={Settings}
        />
        <HeaderButton
          buttonIcon={BsJournal}
          content={LogViewer}
        />
      </div>
    </nav >
  )

}
