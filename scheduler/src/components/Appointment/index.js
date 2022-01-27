import React, { useEffect } from "react";
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
	const interview = props.interview;
	const { mode, transition, back } = useVisualMode(
		interview ? stateMachine.SHOW : stateMachine.EMPTY
	);

	useEffect(() => {
		if (interview && mode === stateMachine.EMPTY) {
			transition(stateMachine.SHOW);
		}
		if (interview === null && mode === stateMachine.SHOW) {
			transition(stateMachine.EMPTY);
		}
	}, [interview, transition, mode]);

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
		<article className="appointment" data-testid="appointment">
			<Header time={props.time} />
			{mode === stateMachine.EMPTY && (
				<Empty onAdd={() => transition(stateMachine.CREATE)} />
			)}
			{mode === stateMachine.SHOW && interview && (
				<Show
					student={interview.student}
					interviewer={interview.interviewer}
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
					name={interview.student}
					interviewers={props.interviewers}
					interviewer={interview && interview.interviewer.id}
					onCancel={() => back()}
					onSave={save}
				/>
			)}
			{mode === stateMachine.SAVING && <Status message="Saving..." />}
			{mode === stateMachine.ERROR_SAVE && (
				<Error
					message="There was an error during saving. Please try again"
					onClose={() => transition(stateMachine.EMPTY, true)}
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
