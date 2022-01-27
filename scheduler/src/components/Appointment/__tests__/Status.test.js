import React from "react";

import { cleanup, render } from "@testing-library/react";

import Status from "components/Appointment/Status";

afterEach(cleanup);

describe("Status", () => {
	it("renders without crashing", () => {
		render(<Status message="Deleting..." />);
	});
});
