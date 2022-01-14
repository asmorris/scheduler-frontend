import React from "react";
import useVisualMode from "hooks/useVisualMode";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

import "./styles.scss";
import Form from "./Form";
import Status from "./Status";

const stateMachine = {
	EMPTY: "EMPTY",
	SHOW: "SHOW",
	CREATE: "CREATE",
	SAVING: "SAVING",
};

export default function Appointment(props) {
	const { mode, transition, back } = useVisualMode(
		props.interview ? stateMachine.SHOW : stateMachine.EMPTY
	);

	const save = (name, interviewer) => {
		transition(stateMachine.SAVING);
		const interview = {
			student: name,
			interviewer,
		};
		props.bookInterview(props.id, interview);
		transition(stateMachine.SHOW);
	};

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
				<Form
					name=""
					interviewers={props.interviewers}
					onCancel={() => back()}
					onSave={save}
				/>
			)}
			{mode === stateMachine.SAVING && <Status />}
		</article>
	);
}
