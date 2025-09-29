import React from "react";
import type { PickResult } from "@/lib/passagePicker";

export default function PassageViewPars({ result }: { result: PickResult | null }) {
	if (!result) return null;

	const paragraphs = result.passage.split(/\n/).map(p => p.trim()).filter(Boolean);

	return (
		<div className="flex flex-col">
			{paragraphs.map((p, i) => (
				<p key={i} className="">
					{p}
				</p>
			))}
		</div>
	)
}


