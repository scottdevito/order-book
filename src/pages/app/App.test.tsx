import React from "react";
import { render, act } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("App renders", () => {
    render(<App />);
  });
});
