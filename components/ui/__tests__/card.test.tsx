import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "../card";

describe("Card components", () => {
  it("Card renders children with correct data-slot", () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText("Card content");
    expect(card).toHaveAttribute("data-slot", "card");
  });

  it("CardHeader renders with correct data-slot", () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText("Header")).toHaveAttribute(
      "data-slot",
      "card-header",
    );
  });

  it("CardTitle renders with correct data-slot", () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText("Title")).toHaveAttribute(
      "data-slot",
      "card-title",
    );
  });

  it("CardDescription renders with correct data-slot", () => {
    render(<CardDescription>Description</CardDescription>);
    expect(screen.getByText("Description")).toHaveAttribute(
      "data-slot",
      "card-description",
    );
  });

  it("CardContent renders with correct data-slot", () => {
    render(<CardContent>Body</CardContent>);
    expect(screen.getByText("Body")).toHaveAttribute(
      "data-slot",
      "card-content",
    );
  });

  it("CardFooter renders with correct data-slot", () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText("Footer")).toHaveAttribute(
      "data-slot",
      "card-footer",
    );
  });

  it("CardAction renders with correct data-slot", () => {
    render(<CardAction>Action</CardAction>);
    expect(screen.getByText("Action")).toHaveAttribute(
      "data-slot",
      "card-action",
    );
  });
});
