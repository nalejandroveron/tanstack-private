import { type DependencyList, useCallback, useRef, useState } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type PromiseType<P extends Promise<any>> = P extends Promise<infer T>
  ? T
  : never;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type FunctionReturningPromise = (...args: any[]) => Promise<any>;

export type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
    }
  | {
      loading: true;
      error?: Error | undefined;
      value?: T;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

type StateFromFunctionReturningPromise<T extends FunctionReturningPromise> =
  AsyncState<PromiseType<ReturnType<T>>>;

export type AsyncFnReturn<
  T extends FunctionReturningPromise = FunctionReturningPromise,
> = [StateFromFunctionReturningPromise<T>, T];

export default function useMutation<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = [],
  initialState: StateFromFunctionReturningPromise<T> = { loading: false },
): AsyncFnReturn<T> {
  const lastCallId = useRef(0);
  const [state, set] =
    useState<StateFromFunctionReturningPromise<T>>(initialState);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const callback = useCallback((...args: Parameters<T>): ReturnType<T> => {
    const callId = ++lastCallId.current;

    if (!state.loading) {
      set((prevState: StateFromFunctionReturningPromise<T>) => ({
        ...prevState,
        loading: true,
      }));
    }

    return fn(...args).then(
      (value: PromiseType<ReturnType<T>>) => {
        callId === lastCallId.current && set({ value, loading: false });

        return value;
      },
      (error: Error) => {
        callId === lastCallId.current && set({ error, loading: false });

        return error;
      },
    ) as ReturnType<T>;
  }, deps);

  return [state, callback as unknown as T];
}
