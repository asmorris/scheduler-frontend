import React from "react";
import InterviewerListItem from "./InterviewerListItem";

import "./InterviewerList.scss";

export default function InterviewerList(props) {
	return (
		<section className="interviewers">
			<h4 className="interviewers__header text--light">Interviewer</h4>
			<ul className="interviewers__list">
				{props.interviewers.map((interviewer) => {
					return (
						<InterviewerListItem
							avatar={interviewer.avatar}
							name={interviewer.name}
							selected={interviewer.id === props.interviewer}
							setInterviewer={() => props.onChange(interviewer.id)}
						/>
					);
				})}
			</ul>
		</section>
	);
}
