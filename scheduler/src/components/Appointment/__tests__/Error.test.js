import React from "react";

import { cleanup, render } from "@testing-library/react";

import Error from "components/Appointment/Error";

afterEach(cleanup);

describe("Error", () => {
	it("renders without crashing", () => {
		render(
			<Error message="Are you sure you want to delete?" onClose={jest.fn()} />
		);
	});
});
