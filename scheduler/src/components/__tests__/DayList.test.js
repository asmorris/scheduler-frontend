import React from "react";

import { cleanup, render } from "@testing-library/react";

import DayList from "components/DayList";

afterEach(cleanup);

describe("DayList", () => {
	const dayList = [
		{
			id: 1,
			name: "Monday",
			spots: "3",
			selected: "true",
			setDay: jest.fn(),
		},
	];
	it("renders without crashing", () => {
		render(<DayList days={dayList} />);
	});

	it("renders correct name crashing", () => {
		const { getByText } = render(<DayList days={dayList} />);
		expect(getByText("Monday")).not.toBeNull();
	});
});
