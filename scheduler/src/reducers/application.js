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

export { reducer, dispatchValues };
