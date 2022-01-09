import React, { useEffect, useState } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";

const appointments = [
	{
		id: 1,
		time: "12pm",
	},
	{
		id: 2,
		time: "1pm",
		interview: {
			student: "Lydia Miller-Jones",
			interviewer: {
				id: 1,
				name: "Sylvia Palmer",
				avatar: "https://i.imgur.com/LpaY82x.png",
			},
		},
	},
	{
		id: 3,
		time: "2pm",
		interview: {
			student: "Johnson McGillvary",
			interviewer: {
				id: 2,
				name: "Francesca Bobbrick",
				avatar: "https://i.imgur.com/LpaY82x.png",
			},
		},
	},
	{
		id: 4,
		time: "3pm",
	},
	{
		id: 3,
		time: "2pm",
		interview: {
			student: "Fran Branston",
			interviewer: {
				id: 2,
				name: "Bolly Johsville",
				avatar: "https://i.imgur.com/LpaY82x.png",
			},
		},
	},
];

export default function Application(props) {
	let [state, setState] = useState({
		day: "Monday",
		days: [],
		// appointments: {}
	});

	const setDay = (day) => setState({ ...state, day });

	useEffect(() => {
		axios.get("/api/days").then((res) => {
			setState((prev) => ({ ...prev, days: res.data }));
		});
	}, []);

	return (
		<main className="layout">
			<section className="sidebar">
				<img
					className="sidebar--centered"
					src="images/logo.png"
					alt="Interview Scheduler"
				/>
				<hr className="sidebar__separator sidebar--centered" />
				<nav className="sidebar__menu">
					<DayList days={state.days} day={state.day} setDay={setDay} />
				</nav>
				<img
					className="sidebar__lhl sidebar--centered"
					src="images/lhl.png"
					alt="Lighthouse Labs"
				/>
			</section>
			<section className="schedule">
				{appointments.map((appointment) => {
					return <Appointment key={appointment.id} {...appointment} />;
				})}
				<Appointment key="last" time="5pm" />
			</section>
		</main>
	);
}
