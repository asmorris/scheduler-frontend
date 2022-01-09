export function getAppointmentsForDay(state, day) {
	const days = state.days;
	const appointments = state.appointments;
	const arr = [];
	days.forEach((d) => {
		if (d.name === day) {
			d.appointments.forEach((appt) => {
				arr.push(appointments[appt]);
			});
		}
	});
	return arr;
}

export function getInterview(state, interview) {
	if (interview === null) return null;
	let interviewerId = interview.interviewer;

	return { ...interview, interviewer: state.interviewers[interviewerId] };
}
