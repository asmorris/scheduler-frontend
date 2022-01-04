import React, { useState } from "react";
import InterviewerListItem from "./InterviewerListItem";

import "./InterviewerList.scss";

export default function InterviewerList(props) {
	const [interviewer, setInterviewer] = useState("");
	return (
		<section className="interviewers">
			<h4 className="interviewers__header text--light">Interviewer</h4>
			<ul className="interviewers__list">
				{props.interviewers.map((inte) => {
					return (
						<InterviewerListItem
							avatar={inte.avatar}
							name={inte.name}
							selected={inte.id === props.interviewer}
							setInterviewer={setInterviewer}
						/>
					);
				})}
			</ul>
		</section>
	);
}
