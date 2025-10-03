// stores/useLogStores.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PickResult } from "@/lib/passagePicker";

export type LogEntry = {
	passage: PickResult | null;
	author: string;
	title: string;
	curScene: number;
	scenes: string[];
};

type LogStore = {
	logs: LogEntry[];
	addLog: (entry: LogEntry) => void;
	setLogs: (logs: LogEntry[]) => void;
	updateLastLogField: (key: keyof LogEntry, value: any) => void;
};

export const useLogStore = create<LogStore>()(
	persist(
		(set, get) => ({
			logs: [],

			addLog: (entry) =>
				set((state) => ({ logs: [...state.logs, entry] })),

			setLogs: (logs) => set({ logs }),

			updateLastLogField: (key, value) =>
				set((state) => {
					if (state.logs.length === 0) return state;
					const idx = state.logs.length - 1;
					const next = [...state.logs];
					next[idx] = { ...next[idx], [key]: value };
					return { logs: next };
				}),
		}),
		{
			name: "log",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

