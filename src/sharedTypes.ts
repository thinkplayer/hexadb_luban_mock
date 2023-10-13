/* eslint-disable @typescript-eslint/ban-types */
/**
 * ajax请求 yield 后类型变为 any的情况处理
 * 
 * 	
 * saveSqlVersion = flow(function* (
		this: SQLProcessStore,
		data: Pick<SQLVersion, 'flowId' | 'description' | 'nodeId'>
	) {
		const result: YieldReturnType<
			typeof saveSqlVersion<
				string,
				Pick<SQLVersion, 'flowId' | 'description' | 'nodeId'>
			>
		> = yield saveSqlVersion<
			string,
			Pick<SQLVersion, 'flowId' | 'description' | 'nodeId'>
		>(data);

		return result;
	});
 * 
 * 
 */
export type YieldReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => Promise<infer R>
  ? R
  : string;

export type FirstParam<T extends (...args: any[]) => any> = Parameters<T>[0];

/**
 * 几个属性必须存在一个
 * 
		type A = {
			a: string;
			b: number;
			c: string;
		};

		type B = EitherOr<A, 'b' | 'a'>;

		const b: B = {
			a: '',
			c: '1'
		}

		const c: B = {
			b: 1,
			c: '1'
		}
		const d: B = {
			a: '',
			b: 1,
			c: '1'
		}
 */

// export type EitherOr<O extends Object, K extends keyof O> = (K extends keyof O
// 	? Pick<O, K>
// 	: never) &
// 	Omit<O, K>;

type FilterOptional<T> = Pick<
  T,
  Exclude<
    {
      [K in keyof T]: T extends Record<K, T[K]> ? K : never;
    }[keyof T],
    undefined
  >
>;

type FilterNotOptional<T> = Pick<
  T,
  Exclude<
    {
      [K in keyof T]: T extends Record<K, T[K]> ? never : K;
    }[keyof T],
    undefined
  >
>;

type PartialEither<T, K extends keyof any> = {
  [P in Exclude<keyof FilterOptional<T>, K>]-?: T[P];
} & { [P in Exclude<keyof FilterNotOptional<T>, K>]?: T[P] } & {
  [P in Extract<keyof T, K>]?: undefined;
};

type Object = {
  [name: string]: any;
};

/**
 * 两个必须存在一个
 */
export type EitherOr<O extends Object, L extends string, R extends string> = (
  | PartialEither<Pick<O, L | R>, L>
  | PartialEither<Pick<O, L | R>, R>
) &
  Omit<O, L | R>;

/**
 * 将指定属性变为可选
 */
export type PickPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export interface PaginationParam {
  page?: number;
  pageSize?: number;
}
