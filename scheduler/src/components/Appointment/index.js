import React from "react";
import useVisualMode from "hooks/useVisualMode";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

import "./styles.scss";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

const stateMachine = {
	EMPTY: "EMPTY",
	SHOW: "SHOW",
	CREATE: "CREATE",
	SAVING: "SAVING",
	DELETING: "DELETING",
	EDIT: "EDIT",
	ERROR_SAVE: "ERROR_SAVE",
	ERROR_DELETE: "ERROR_DELETE",
};

export default function Appointment(props) {
	const { mode, transition, back } = useVisualMode(
		props.interview ? stateMachine.SHOW : stateMachine.EMPTY
	);

	const save = (name, interviewer) => {
		const interview = {
			student: name,
			interviewer,
		};
		transition(stateMachine.SAVING);

		props
			.bookInterview(props.id, interview)
			.then(() => transition(stateMachine.SHOW))
			.catch(() => transition(stateMachine.ERROR_SAVE, true));
	};

	const destroy = () => {
		transition(stateMachine.DELETING, true);
		props
			.cancelInterview(props.id)
			.then(() => transition(stateMachine.EMPTY))
			.catch(() => transition(stateMachine.ERROR_DELETE, true));
	};

	const cancelInterview = () => {
		return transition(stateMachine.CONFIRM);
	};

	const editInterview = () => {
		return transition(stateMachine.EDIT);
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
			{mode === stateMachine.ERROR_SAVE && (
				<Error
					message="There was an error during saving. Please try again"
					onClose={() => back()}
				/>
			)}
			{mode === stateMachine.ERROR_DELETE && (
				<Error
					message="There was an error during deleting. Please try again"
					onClose={() => transition(stateMachine.SHOW, true)}
				/>
			)}
			{mode === stateMachine.DELETING && <Status message="Deleting..." />}
			{mode === stateMachine.CONFIRM && (
				<Confirm
					message="Are you sure you want to delete?"
					onConfirm={destroy}
					onCancel={() => transition(stateMachine.SHOW)}
				/>
			)}
		</article>
	);
}
