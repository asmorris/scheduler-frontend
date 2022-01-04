import React from "react";
import classNames from "classnames";

import "./InterviewerListItem.scss";

export default function InterviewerListItem(props) {
	return (
		<li
			onClick={() => props.setInterviewer(props.name)}
			className={classNames("interviewers__item", {
				"interviewers__item--selected": props.selected,
			})}
		>
			<img
				className="interviewers__item-image"
				src={props.avatar}
				alt={props.name}
			/>
			{props.selected && props.name}
		</li>
	);
}
