import * as Types from ".";

type T1 = Types.Flatten<{
	a: string;
	b: number;
	c: {
		d: boolean;
	};
}>;
