export class NotImplementedError extends Error {
  constructor(method: string) {
    super(`${method} is not implemented`);
    this.name = "NotImplementedError";
  }
}

export function canNotReach(type: never) {
  throw new Error(`can not reach here: ${type}`);
}
