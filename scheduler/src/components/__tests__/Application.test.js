import React from "react";
import axios from "axios";

import {
	render,
	cleanup,
	waitForElement,
	fireEvent,
	getByText,
	getAllByTestId,
	getByAltText,
	getByPlaceholderText,
	queryByText,
	prettyDOM,
	getByTestId,
} from "@testing-library/react";

import Application from "components/Application";
import { act } from "@testing-library/react-hooks";

afterEach(cleanup);

describe("Application", () => {
	it("changes the schedule when a new day is selected", () => {
		const { getByText } = render(<Application />);

		return waitForElement(() => getByText("Monday")).then(() => {
			fireEvent.click(getByText("Tuesday"));
			expect(getByText("Leopold Silvers")).toBeInTheDocument();
		});
	});

	it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
		const { container } = render(<Application />);

		await waitForElement(() => getByText(container, "Archie Cohen"));
		const appointments = getAllByTestId(container, "appointment");
		const appointment = appointments[0];

		act(() => {
			fireEvent.click(getByAltText(appointment, "Add"));
			fireEvent.change(
				getByPlaceholderText(appointment, /enter student name/i),
				{
					target: { value: "Lydia Miller-Jones" },
				}
			);
			fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
			fireEvent.click(getByText(appointment, "Save"));
		});
		expect(getByText(appointment, "Saving...")).toBeInTheDocument();

		await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

		const day = getAllByTestId(container, "day").find((day) =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "no spots remaining")).toBeInTheDocument();
	});

	it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
		const { container } = render(<Application />);

		await waitForElement(() => getByText(container, "Archie Cohen"));
		const appointments = getAllByTestId(container, "appointment");
		const appointment = appointments[1];

		act(() => {
			fireEvent.click(getByAltText(appointment, "Delete"));
		});

		expect(
			getByText(appointment, "Are you sure you want to delete?")
		).toBeInTheDocument();

		act(() => {
			fireEvent.click(getByText(appointment, "Confirm"));
		});

		expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

		await waitForElement(() => getByAltText(appointment, "Add"));

		const day = getAllByTestId(container, "day").find((day) =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
	});

	it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
		const { container } = render(<Application />);

		await waitForElement(() => getByText(container, "Archie Cohen"));
		const appointments = getAllByTestId(container, "appointment");
		const appointment = appointments[1];

		act(() => {
			fireEvent.click(getByAltText(appointment, "Edit"));
		});

		act(() => {
			fireEvent.change(getByTestId(appointment, "student-name-input"), {
				target: { value: "Lydia Miller-Jones" },
			});
		});

		act(() => {
			fireEvent.click(getByText(appointment, "Save"));
		});

		expect(getByText(appointment, "Saving...")).toBeInTheDocument();

		await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

		const day = getAllByTestId(container, "day").find((day) =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
	});

	it("shows the save error when failing to save an appointment", async () => {
		axios.put.mockRejectedValueOnce();
		const { container } = render(<Application />);

		await waitForElement(() => getByText(container, "Archie Cohen"));
		const appointments = getAllByTestId(container, "appointment");
		const appointment = appointments[1];

		act(() => {
			fireEvent.click(getByAltText(appointment, "Edit"));
		});

		act(() => {
			fireEvent.change(getByTestId(appointment, "student-name-input"), {
				target: { value: "Lydia Miller-Jones" },
			});
		});

		act(() => {
			fireEvent.click(getByText(appointment, "Save"));
		});

		expect(getByText(appointment, "Saving...")).toBeInTheDocument();

		await waitForElement(() =>
			getByText(
				appointment,
				"There was an error during saving. Please try again"
			)
		);

		expect(
			getByText(
				appointment,
				"There was an error during saving. Please try again"
			)
		).toBeInTheDocument();

		const day = getAllByTestId(container, "day").find((day) =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
	});

	it("shows the delete error when failing to delete an existing appointment", async () => {
		axios.delete.mockRejectedValueOnce();
		const { container } = render(<Application />);

		await waitForElement(() => getByText(container, "Archie Cohen"));
		const appointments = getAllByTestId(container, "appointment");
		const appointment = appointments[1];

		act(() => {
			fireEvent.click(getByAltText(appointment, "Delete"));
		});

		expect(
			getByText(appointment, "Are you sure you want to delete?")
		).toBeInTheDocument();

		act(() => {
			fireEvent.click(getByText(appointment, "Confirm"));
		});

		expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

		await waitForElement(() =>
			getByText(
				appointment,
				"There was an error during deleting. Please try again"
			)
		);

		expect(
			getByText(
				appointment,
				"There was an error during deleting. Please try again"
			)
		).toBeInTheDocument();

		const day = getAllByTestId(container, "day").find((day) =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
	});
});
