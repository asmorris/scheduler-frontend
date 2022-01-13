import { useState } from "react";

export default function useVisualMode(initial = "First") {
	const [mode, setMode] = useState(initial);
	const [history, setHistory] = useState([initial]);

	function transition(newMode, replace = false) {
		if (history[0] !== mode) {
			const newHist = replace ? [...history] : [...history, mode];
			setHistory(newHist);
		}
		setMode(newMode);
	}

	function back() {
		let newMode = history[history.length - 1];
		if (history.length !== 1) {
			newMode = history.pop();
		}
		setHistory([...history]);
		setMode(newMode);
	}

	return { mode, transition, back };
}
