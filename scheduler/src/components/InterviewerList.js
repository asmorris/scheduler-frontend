import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import PropTypes from "prop-types";

import "./InterviewerList.scss";

InterviewerList.propTypes = {
	interviewers: PropTypes.array.isRequired,
};

export default function InterviewerList(props) {
	return (
		<section className="interviewers">
			<h4 className="interviewers__header text--light">Interviewer</h4>
			<ul className="interviewers__list">
				{props.interviewers.map((interviewer) => {
					return (
						<InterviewerListItem
							key={interviewer.id}
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
