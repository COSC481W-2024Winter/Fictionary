import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App.js";
//import "setimmediate";

test("loads and loops through game states", async () => {
    render(<App />);
    // starts at home page
    expect(screen.getByText("Fictionary"));
    expect(screen.getByText("Create a Room"));
    await userEvent.click(screen.getByText("Create a Room"));
    
    // create a room page (host page)
    expect(screen.getByText("Enter Your Name (Host):")); 
    const inputElement = document.getElementById("name");
    await userEvent.type(inputElement, "myUsername");
    await userEvent.click(screen.getByText("Enter"));
    // line above causes terminal to show "errors" but these are warnings in react that don't cause any bugs

    // ROOM.JS TESTING STARTS HERE ----------

    // testing Lobby.js component
    expect(screen.getByText("Lobby"));
    await userEvent.click(screen.getByText("Start"));

    // testing Categories.js component
    expect(screen.getByText("Vote for a Category"));
    await userEvent.click(screen.getByText("(this should not be visible)"));

    // testing Drawing.js component
    expect(screen.getByText("Drawing Tools"));
    await userEvent.click(screen.getByText("Submit Drawing"));

    // testing Voting.js component
    expect(screen.getByText("CATEGORY IS"));
    await userEvent.click(screen.getByText("Submit"));

    // testing Results.js component
    expect(screen.getByText("Everyone's Guesses"));
    await userEvent.click(screen.getByTestId("results-ctn-btn"));

    // testing Scoreboard.js component
    expect(screen.getByText("Scores:"));
    expect(screen.getByText("Next Artist:"));
    await userEvent.click(screen.getByTestId("scoreboard-ctn-btn"));

    // back to Categories.js component
    expect(screen.getByText("Vote for a Category"));
});