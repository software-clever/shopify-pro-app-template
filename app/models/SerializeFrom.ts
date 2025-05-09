export type SerializeFrom<T extends (...args: never[]) => unknown> = Awaited<ReturnType<T>>;
