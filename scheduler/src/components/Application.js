import React, { useEffect, useState } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import {
	getAppointmentsForDay,
	getInterview,
	getInterviewersForDay,
} from "../helpers/selectors";

export default function Application(props) {
	let [state, setState] = useState({
		day: "Monday",
		days: [],
		appointments: {},
		interviewers: {},
	});

	const setDay = (day) => setState({ ...state, day });
	let dailyAppointments = [];
	let dailyInterviewers = [];

	useEffect(() => {
		const getDays = axios.get("/api/days");
		const getAppointments = axios.get("/api/appointments");
		const getInterviewers = axios.get("/api/interviewers");
		Promise.all([getDays, getAppointments, getInterviewers]).then((all) => {
			const [days, appointments, interviewers] = all;

			setState((prev) => ({
				...prev,
				days: days.data,
				appointments: appointments.data,
				interviewers: interviewers.data,
			}));
		});
	}, []);

	const bookInterview = (id, interview) => {
		const appointment = {
			...state.appointments[id],
			interview: { ...interview },
		};

		const appointments = {
			...state.appointments,
			[id]: appointment,
		};
		axios
			.put(`/api/appointments/${id}`, appointment)
			.then(setState({ ...state, appointments }));
	};

	const cancelInterview = (interviewId) => {
		let appointments = state.appointments;
		let { id, time } = state.appointments[interviewId];
		setState({
			...state,
			appointments: {
				...appointments,
				[interviewId]: { id, time, interview: null },
			},
		});
	};

	dailyAppointments = getAppointmentsForDay(state, state.day);
	dailyInterviewers = getInterviewersForDay(state, state.day);

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
					const interview = getInterview(state, appointment.interview);
					return (
						<Appointment
							key={appointment.id}
							{...appointment}
							interview={interview}
							bookInterview={bookInterview}
							interviewers={dailyInterviewers}
							cancelInterview={cancelInterview}
						/>
					);
				})}
				<Appointment key="last" time="5pm" />
			</section>
		</main>
	);
}
