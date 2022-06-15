export type Key = keyof any;
export type BasicPrimitive = boolean | number | string;
export type Primitive = BasicPrimitive | bigint | null | symbol | undefined;
export type ValueOf<T> = T[keyof T];
export type PlainObject = { [k: string]: any };
export type IsPlainObject<T> = T extends PlainObject ? true : false;
export type ArrayType<T> = T extends Array<infer U> ? U : unknown;
export type MaybeArray<T> = T extends Array<any> ? ArrayType<T> | T : T | T[];
export type MaybePlainObject<T> = IsPlainObject<T> extends true ? T : T | PlainObject;
export type IsTuple<T> = T extends any[] ? (T["length"] extends number ? (number extends T["length"] ? false : true) : true) : false;
export type IsEmptyTuple<T> = T extends any[] ? (T["length"] extends 0 ? true : false) : false;
//@ts-ignore
export type TupleType<T> = IsTuple<T> extends 1 ? T[number] : unknown;
export type Tuple<L extends number, Item extends any = any> = [Item, ...Item[]] & { length: L };

export type JSONValue = Primitive | JSONObject | JSONArray;
export type IsNever<T> = [T] extends [never] ? 1 : 0;

interface JSONObject {
	[key: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}
export type Optional<T extends PlainObject, K extends string> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepOptional<T extends PlainObject, K extends string> = K extends `${infer Parent}.${infer Child}`
	? Omit<T, Parent> & {
			[P in Parent]: DeepOptional<T[Parent], Child>;
	  }
	: Optional<T, K>;

export type DeepPartial<T extends PlainObject> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};
export type DeepRequired<T extends PlainObject> = {
	[P in keyof T]-?: DeepRequired<T[P]>;
};
/** 获取Promise泛型 */
export type PromiseType<T> = T extends Promise<infer R> ? R : T;
/** 获取函数返回值的Promise泛型 */
export type returnTypePromise<T extends (...args: any) => any> = PromiseType<ReturnType<T>>;
/** 重写对象属性 */
export type Overwrite<T extends PlainObject, U extends PlainObject> = Omit<T, keyof U> & U;
/** 获取两个类型的交集 */
export type Difference<T extends PlainObject, U extends PlainObject> = Omit<T, keyof U> | Omit<U, keyof T>;
/** 获取两个类型的差集 */
export type Intersection<T extends object, U extends object> = Pick<T, Extract<keyof T, keyof U> & Extract<keyof U, keyof U>>;
/** 获取两个类型的并集 */
export type Union<T extends PlainObject, U extends PlainObject> = Intersection<T, U> | Difference<T, U>;
export type Mutable<T extends PlainObject> = {
	-readonly [K in keyof T]: T[K];
};
export type MutableKeys<T, K extends keyof T> = Omit<T, K> & Mutable<{ [P in K]: T[P] }>;
export type ReadonlyKeys<T extends object> = {
	[P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>;
}[keyof T];

export type PickByValue<T, ValueType> = Pick<T, { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]>;
export type OmitByValueExact<T, V> = Pick<
	T,
	{
		[K in keyof T]-?: [V] extends [T[K]] ? ([T[K]] extends [V] ? never : K) : K;
	}[keyof T]
>;

const a: MutableKeys<{ readonly a: string }, "a"> = { a: "1" };

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;
type Boolean = 0 | 1;
type If<B extends Boolean, Then, Else = never> = B extends 1 ? Then : Else;
type Extends<A, B> = If<IsNever<A>, 0, A extends B ? 1 : 0>;
type Try<A, B, Catch = B> = A extends B ? A : Catch;
type And<A extends Boolean, B extends Boolean> = {
	0: {
		0: 0;
		1: 0;
	};
	1: {
		0: 0;
		1: 1;
	};
}[A][B];
