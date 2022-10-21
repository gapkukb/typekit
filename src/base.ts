export type Key = keyof any;
export type BasicPrimitive = boolean | number | string;
export type Primitive = BasicPrimitive | bigint | null | symbol | undefined;
export type ValueOf<T> = T[keyof T];
export type Dictionary = { [k: string]: any };
export type IsDictionary<T> = T extends Dictionary ? true : false;
export type ArrayType<T> = T extends Array<infer U> ? U : unknown;
export type MaybeArray<T> = T extends Array<any> ? ArrayType<T> | T : T | T[];
export type MaybeDictionary<T> = IsDictionary<T> extends true ? T : T | Dictionary;
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
export type Optional<T extends Dictionary, K extends string> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepOptional<T extends Dictionary, K extends string> = K extends `${infer Parent}.${infer Child}`
	? Omit<T, Parent> & {
			[P in Parent]: DeepOptional<T[Parent], Child>;
	  }
	: Optional<T, K>;

export type DeepPartial<T extends Dictionary> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};
export type DeepRequired<T extends Dictionary> = {
	[P in keyof T]-?: DeepRequired<T[P]>;
};
/** 获取Promise泛型 */
export type PromiseType<T> = T extends Promise<infer R> ? R : T;
/** 获取函数返回值的Promise泛型 */
export type PromiseReturnType<T extends (...args: any) => any> = PromiseType<ReturnType<T>>;
/** 重写对象属性 */
export type Overwrite<T extends Dictionary, U extends Dictionary> = Omit<T, keyof U> & U;
/** 获取两个类型的交集 */
export type Difference<T extends Dictionary, U extends Dictionary> = Omit<T, keyof U> | Omit<U, keyof T>;
/** 获取两个类型的差集 */
export type Intersection<T extends object, U extends object> = Pick<T, Extract<keyof T, keyof U> & Extract<keyof U, keyof U>>;
/** 获取两个类型的并集 */
export type Union<T extends Dictionary, U extends Dictionary> = Intersection<T, U> | Difference<T, U>;
/** 去除 readonly 修饰 */
export type Mutable<T extends Dictionary> = {
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

export type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;
export type Boolean = 0 | 1;
export type If<B extends Boolean, Then, Else = never> = B extends 1 ? Then : Else;
export type Extends<A, B> = If<IsNever<A>, 0, A extends B ? 1 : 0>;
export type Try<A, B, Catch = B> = A extends B ? A : Catch;
export type And<A extends Boolean, B extends Boolean> = {
	0: {
		0: 0;
		1: 0;
	};
	1: {
		0: 0;
		1: 1;
	};
}[A][B];

/**
 * 对象的必选属性
 * eg:{a:x,b?:x,c:x}->='a'|'c'
 */
export type RequiredKeys<T extends Dictionary, KS extends keyof T = keyof T> = {
	[K in KS]-?: T[K] extends {} ? K : never;
}[KS];

/**
 * 对象的可选属性
 * eg:{a?:x,b?:x,c:x}->='a'|'b'
 */
export type OptionalKeys<T extends Dictionary> = Exclude<keyof T, RequiredKeys<T>>;

/**
 * 反转对象的可选必选属性
 * {a:x,b?:x}->{a?:x,b:x}
 */
export type Flip<T extends Dictionary, K extends RequiredKeys<T> = RequiredKeys<T>> = Partial<Pick<T, K>> & Required<Omit<T, K>>;

/**
 * 至少必填一个属性
 * - {a:x,b:x} -> {a:x,b?:x}|{a?:x,b:x}
 */
export type AtLeastOne<T, KS extends keyof T = keyof T> = { [K in KS]-?: Required<Pick<T, K>> & Partial<Omit<T, K>> }[KS];
/**
 * 排除类型
 */
export type Not<T extends Primitive | object> = Exclude<Primitive | object, T>;

/**
 * 从T的key中排除包含在u中的key
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * T和 U两种类型二选一
 */
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

/**
 * 获取对象的所有属性路径
 */
// type KeyPath<T extends object, S extends string = "."> = {
// 	[K in keyof T]: T[K] extends object ? K | `${K}${S}${DeepKeys<T[K], S>}` : K;
// }[keyof T];

// type i = DeepKeys<{ a: { b: { c: number }; f: boolean } }, "/">;

// declare function test<T>(params:) {

// }
