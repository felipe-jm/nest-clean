export class Slug {
  public value: string;

  protected constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    return new Slug(value);
  }

  /**
   * @description Receives a string and normalizes it to a slug
   * @param text - The text to create the slug from
   *
   * Example: "An example question" -> "an-example-question"
   *
   * @returns A new Slug instance
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize("NFKD")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/_/g, "-")
      .replace(/--+/g, "-")
      .replace(/-$/g, "");

    return new Slug(slugText);
  }
}
