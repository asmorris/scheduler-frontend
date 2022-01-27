import React from "react";

import { cleanup, render } from "@testing-library/react";

import Confirm from "components/Appointment/Confirm";

afterEach(cleanup);

describe("Confirm", () => {
	it("renders without crashing", () => {
		render(
			<Confirm
				message="Are you sure you want to delete?"
				onConfirm={jest.fn()}
				onCancel={jest.fn()}
			/>
		);
	});
});
