import { useReducer, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";
import Error from "components/Appointment/Error";

const dispatchValues = {
	INCREMENT: "INCREMENT",
	DECREMENT: "DECREMENT",
	SET_DAY: "SET_DAY",
	SET_APPLICATION_DATA: "SET_APPLICATION_DATA",
	SET_INTERVIEW: "SET_INTERVIEW",
	UPDATE_SPOTS: "UPDATE_SPOTS",
};

const reducer = (state, action) => {
	switch (action.type) {
		case dispatchValues.SET_DAY:
			return {
				...state,
				day: action.value,
			};
		case dispatchValues.SET_APPLICATION_DATA:
			const { day, days, appointments, interviewers } = action.value;
			return {
				day,
				days,
				appointments,
				interviewers,
			};
		case dispatchValues.SET_INTERVIEW:
			return {
				...state,
				appointments: action.value.appointments,
			};
		case dispatchValues.UPDATE_SPOTS:
			return {
				...state,
				days: action.value.days,
			};
		default:
			throw new Error(
				`Tried to reduce with unsupported action type ${action.type}`
			);
	}
};

export default function useApplicationData() {
	const [state, dispatch] = useReducer(reducer, {
		day: "Monday",
		days: [],
		appointments: {},
		interviewers: {},
	});
	useEffect(() => {
		const getDays = axios.get("/api/days");
		const getAppointments = axios.get("/api/appointments");
		const getInterviewers = axios.get("/api/interviewers");
		Promise.all([getDays, getAppointments, getInterviewers]).then((all) => {
			const [days, appointments, interviewers] = all;

			dispatch({
				type: dispatchValues.SET_APPLICATION_DATA,
				value: {
					day: "Monday",
					days: days.data,
					appointments: appointments.data,
					interviewers: interviewers.data,
				},
			});
		});
	}, []);

	const setDay = (value) => dispatch({ type: dispatchValues.SET_DAY, value });

	const bookInterview = async (id, interview) => {
		/*
			This piece is for if the user forgets to add an interviewer - originally it just broke the app. This adds the error state and everything to that, but complicates things.
			I had to move to async await pattern to make things work for this, not entirely sure what the reason behind that was.
		*/
		if (!interview.interviewer) {
			throw new Error("No interviewer selected");
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

		if (res.status === 204) {
			updateSpots(dispatchValues.DECREMENT);
			dispatch({
				type: dispatchValues.SET_INTERVIEW,
				value: { appointments },
			});
		} else {
			throw new Error("Could not save value");
		}
	};

	const cancelInterview = async (interviewId) => {
		let appointments = state.appointments;
		let appointment = state.appointments[interviewId];
		let { id, time } = appointment;
		let res = await axios.delete(`/api/appointments/${appointment.id}`);

		if (res) {
			updateSpots(dispatchValues.INCREMENT);
			dispatch({
				type: dispatchValues.SET_INTERVIEW,
				value: {
					appointments: {
						...appointments,
						[interviewId]: { id, time, interview: null },
					},
				},
			});
		} else {
			throw new Error("Could not delete");
		}
	};

	const updateSpots = (operation) => {
		let dailyAppointments = getAppointmentsForDay(state, state.day);
		let numSpots = dailyAppointments.reduce((acc, val) => {
			return val.interview === null ? (acc += 1) : acc;
		}, 0);

		const newSpots =
			operation === dispatchValues.DECREMENT
				? (numSpots -= 1)
				: (numSpots += 1);

		let day = state.days.filter((day) => day.name === state.day)[0];
		day = { ...day, spots: newSpots };
		var newDays = [...state.days];
		newDays[day.id - 1] = day;
		dispatch({
			type: dispatchValues.UPDATE_SPOTS,
			value: { days: newDays },
		});
	};

	return { state, setDay, bookInterview, cancelInterview };
}
