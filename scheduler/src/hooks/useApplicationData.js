import { useReducer, useEffect, useRef } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";
import Error from "components/Appointment/Error";

import { reducer, dispatchValues } from "reducers/application";

export default function useApplicationData() {
	const [state, dispatch] = useReducer(reducer, {
		day: "Monday",
		days: [],
		appointments: {},
		interviewers: {},
	});
	const socket = useRef(null);

	useEffect(() => {
		socket.current = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}`);
		socket.current.onopen = () => socket.current.send("ping");
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
		return () => {
			socket.current.close();
		};
	}, []);

	const setDay = (value) => dispatch({ type: dispatchValues.SET_DAY, value });

	const bookInterview = async (id, interview) => {
		if (!interview.interviewer) {
			throw new Error("No interviewer selected");
		}

		const appointment = {
			...state.appointments[id],
			interview: { ...interview },
		};

		const prevAppointments = { ...state.appointments };

		const appointments = {
			...prevAppointments,
			[id]: appointment,
		};

		const res = await axios.put(`/api/appointments/${id}`, appointment);

		if (res.status === 204) {
			if (prevAppointments[appointment.id].interview === null) {
				updateSpots(dispatchValues.DECREMENT);
			}
			dispatch({
				type: dispatchValues.SET_INTERVIEW,
				value: { appointments },
			});
			socket.current.send(
				JSON.stringify({
					type: "SET_INTERVIEW",
					id,
					interview: {
						student: interview.student,
						interviewer: {
							id: interview.interviewer.id,
							name: interview.interviewer.name,
							avatar: interview.interviewer.avatar,
						},
					},
				})
			);
		} else {
			throw new Error("Could not save value");
		}
	};

	if (socket.current) {
		socket.current.onmessage = (event) => {
			let appointments = state.appointments;
			const data = JSON.parse(event.data);

			if (data.type === "SET_INTERVIEW") {
				dispatch({
					type: dispatchValues.SET_INTERVIEW,
					value: {
						appointments: {
							...appointments,
							[data.id]: {
								interview: data.interview ? { ...data.interview } : null,
							},
						},
					},
				});
				data.interview
					? updateSpots(dispatchValues.DECREMENT)
					: updateSpots(dispatchValues.INCREMENT);
			}
		};
	}

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
			socket.current.send(
				JSON.stringify({
					type: "SET_INTERVIEW",
					id,
					interview: null,
				})
			);
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
