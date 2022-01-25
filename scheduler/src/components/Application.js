import React from "react";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import {
	getAppointmentsForDay,
	getInterview,
	getInterviewersForDay,
} from "../helpers/selectors";

import useApplicationData from "hooks/useApplicationData";

export default function Application() {
	const { state, setDay, bookInterview, cancelInterview } =
		useApplicationData();

	let dailyAppointments = [];
	let dailyInterviewers = [];

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
