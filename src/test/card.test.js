import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Card from "../components/Card/Card";

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("renders with or without a name", () => {
    act(() => {
    render(<Card />, container);
    });
    expect(container.textContent).toBe("");

    act(() => {
    render(<Card title="First Test" />, container);
    });
    expect(container.textContent).toBe("First Test");

    act(() => {
    render(<Card title="Second Test" />, container);
    });
    expect(container.textContent).toBe("Second Test");
});