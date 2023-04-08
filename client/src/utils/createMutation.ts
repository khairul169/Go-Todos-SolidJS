import { createSignal } from "solid-js";

type MutatorFn<T, U> = (variables: U) => Promise<T>;

type MutationOptions<T, U> = {
  allowMultiple?: boolean;
  onSuccess: (data: T, variables: U) => void;
  onError: (error: Error, variables: U) => void;
  onSettled: (data: T | null, error: Error | null, variables: U) => void;
};

const createMutation = <T, U>(
  mutator: MutatorFn<T, U>,
  options: Partial<MutationOptions<T, U>> = {}
) => {
  const [isLoading, setLoading] = createSignal<boolean>(false);
  const [error, setError] = createSignal<Error | null>(null);
  const [data, setData] = createSignal<T | null>(null);

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  const mutate = async (variables: U) => {
    const { onSuccess, onError, onSettled, allowMultiple } = options;
    if (!allowMultiple && isLoading()) {
      return;
    }

    try {
      setLoading(true);
      setData(null);

      const result = await mutator(variables);
      setData(result as any);

      if (onSuccess) {
        onSuccess(result, variables);
      }
    } catch (err) {
      const errData = err instanceof Error ? err : new Error("Network error!");
      setError(errData);

      if (onError) {
        onError(errData, variables);
      }
    } finally {
      setLoading(false);

      if (onSettled) {
        onSettled(data(), error(), variables);
      }
    }
  };

  return { data, isLoading, error, reset, mutate };
};

export default createMutation;
