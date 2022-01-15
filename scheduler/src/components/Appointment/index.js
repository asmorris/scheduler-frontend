import React, { useCallback } from "react";
import useVisualMode from "hooks/useVisualMode";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

import "./styles.scss";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

const stateMachine = {
	EMPTY: "EMPTY",
	SHOW: "SHOW",
	CREATE: "CREATE",
	SAVING: "SAVING",
	DELETING: "DELETING",
	EDIT: "EDIT",
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

	const cancelInterview = () => {
		transition(stateMachine.CONFIRM);
	};

	const editInterview = () => {
		transition(stateMachine.EDIT);
	};

	const handleConfirmStatus = () => {
		props.cancelInterview(props.id);
		transition(stateMachine.EMPTY);
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
					onDelete={cancelInterview}
					onEdit={editInterview}
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
			{mode === stateMachine.EDIT && (
				<Form
					name={props.interview.student}
					interviewers={props.interviewers}
					interviewer={props.interview.interviewer.id}
					onCancel={() => back()}
					onSave={save}
				/>
			)}
			{mode === stateMachine.SAVING && <Status message="Saving..." />}
			{mode === stateMachine.DELETING && <Status message="Deleting..." />}
			{mode === stateMachine.CONFIRM && (
				<Confirm
					message="Are you sure you want to delete?"
					onConfirm={handleConfirmStatus}
					onCancel={() => transition(stateMachine.SHOW)}
				/>
			)}
		</article>
	);
}
