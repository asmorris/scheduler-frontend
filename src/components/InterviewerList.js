import React, { useState } from "react";
import InterviewerListItem from "./InterviewerListItem";

import "./InterviewerList.scss";

export default function InterviewerList(props) {
	const [_, setInterviewer] = useState("");
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
							setInterviewer={() => setInterviewer(interviewer.id)}
						/>
					);
				})}
			</ul>
		</section>
	);
}
