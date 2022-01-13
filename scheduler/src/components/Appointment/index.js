import React from "react";
import useVisualMode from "hooks/useVisualMode";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

import "./styles.scss";
import Form from "./Form";

const stateMachine = {
	EMPTY: "EMPTY",
	SHOW: "SHOW",
	CREATE: "CREATE",
};

export default function Appointment(props) {
	const { mode, transition, back } = useVisualMode(
		props.interview ? stateMachine.SHOW : stateMachine.EMPTY
	);
	return (
		<article className="appointment">
			<Header time={props.time} />
			{mode === stateMachine.EMPTY && (
				<Empty onAdd={() => transition(stateMachine.CREATE)} />
			)}
			{mode === stateMachine.SHOW && (
				<Show
					student={props.interview.student}
					interviewer={props.interview.interviewer}
				/>
			)}
			{mode === stateMachine.CREATE && (
				<Form name="" interviewers={[]} onCancel={() => back()} />
			)}
		</article>
	);
}
