import React, { useEffect, useState } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay } from "../helpers/selectors";

export default function Application(props) {
	let [state, setState] = useState({
		day: "Monday",
		days: [],
		appointments: {},
	});

	const setDay = (day) => setState({ ...state, day });
	let dailyAppointments = [];

	useEffect(() => {
		const getDays = axios.get("/api/days");
		const getAppointments = axios.get("/api/appointments");
		const getInterviewers = axios.get("/api/interviewers");
		Promise.all([getDays, getAppointments, getInterviewers]).then((all) => {
			const [days, appointments, interviewers] = all;

			console.log("DAYS", days.data);
			console.log("APPTS", appointments.data);
			setState((prev) => ({
				...prev,
				days: days.data,
				appointments: appointments.data,
			}));
		});
	}, []);

	dailyAppointments = getAppointmentsForDay(state, state.day);
	console.log(dailyAppointments);
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
				{dailyAppointments.map((appointment) => {
					return <Appointment key={appointment.id} {...appointment} />;
				})}
				<Appointment key="last" time="5pm" />
			</section>
		</main>
	);
}
