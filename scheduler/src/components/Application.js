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

	const bookInterview = async (id, interview) => {
		/*
			This piece is for if the user forgets to add an interviewer - originally it just broke the app. This adds the error state and everything to that, but complicates things.
			I had to move to async await pattern to make things work for this, not entirely sure what the reason behind that was.
		*/
		if (!interview.interviewer) {
			throw "No interviewer selected";
		}

		const appointment = {
			...state.appointments[id],
			interview: { ...interview },
		};

		const appointments = {
			...state.appointments,
			[id]: appointment,
		};

		const res = await axios.put(`/api/appointments/${id}`, appointment);

		if (res) {
			return setState({ ...state, appointments });
		} else {
			throw "Could not save value";
		}
	};

	const cancelInterview = async (interviewId) => {
		let appointments = state.appointments;
		let appointment = state.appointments[interviewId];
		let { id, time } = appointment;
		let res = await axios.delete(`/api/appointments/${appointment.id}`);

		if (res) {
			return setState({
				...state,
				appointments: {
					...appointments,
					[interviewId]: { id, time, interview: null },
				},
			});
		} else {
			throw "Could not delete";
		}
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
