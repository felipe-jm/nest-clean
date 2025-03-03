import { expect, it } from "vitest";
import { Slug } from "./slug";

it("should be able to create a new slug from text", () => {
  const slug = Slug.createFromText("Example question title");

  expect(slug.value).toBe("example-question-title");
});

it("should be able to create a new slug from text with multiple words", () => {
  const slug = Slug.createFromText("Example question with multiple words");

  expect(slug.value).toBe("example-question-with-multiple-words");
});
