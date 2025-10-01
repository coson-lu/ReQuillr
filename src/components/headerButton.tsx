"use client";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { RxCross2 } from "react-icons/rx";

interface HeaderProps {
	buttonIcon: IconType;
	content: React.ComponentType;
}

export default function HeaderButton({ buttonIcon: Icon, content: Content }: HeaderProps) {
	const [showContent, setShowContent] = useState(false);

	return (
		<div>
			<span
				onClick={() => setShowContent((prev) => !prev)}
				className="text-2xl hover:cursor-pointer"
			>
				<Icon />
			</span>
			<div
				className={`w-screen h-screen fixed left-0 top-0 z-50 transition-all duration-150 ${showContent
					? 'opacity-100 backdrop-blur-xl pointer-events-auto'
					: 'opacity-0 backdrop-blur-none pointer-events-none'
					}`}
			>
				<span
					onClick={() => setShowContent(false)}
					className="text-2xl absolute left-[6vh] top-[6vh] hover:cursor-pointer"
				>
					<RxCross2 />
				</span>
				<Content />
			</div>
		</div>
	);
}
