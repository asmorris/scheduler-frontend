import React from "react";

import { cleanup, render } from "@testing-library/react";

import Show from "components/Appointment/Show";

afterEach(cleanup);

describe("Show", () => {
	const student = "Luke Skywalker";
	const interviewer = {
		name: "Yoda",
	};
	const onDelete = jest.fn();
	const onEdit = jest.fn();

	it("renders without crashing", () => {
		render(
			<Show
				student={student}
				interviewer={interviewer}
				onDelete={onDelete}
				onEdit={onEdit}
			/>
		);
	});
});
