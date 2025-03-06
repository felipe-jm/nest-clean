export class StudentAlreadyExistsError extends Error {
  constructor(identifier: string) {
    super(`Student ${identifier} already exists.`);
  }
}
