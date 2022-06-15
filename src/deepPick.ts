export type DeepPick<T, Path extends string> = T extends object
	? Path extends `${infer Prev}.${infer Next}`
		? Prev extends keyof T
			? DeepPick<T[Prev], Next>
			: never
		: Path extends keyof T
		? T[Path]
		: never
	: never;
