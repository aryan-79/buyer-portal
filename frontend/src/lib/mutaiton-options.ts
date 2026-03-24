import type { UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getContext } from '@/integrations/tanstack-query/provider';

type TResponse<T> = {
  success: true;
  message: string;
  data: T;
};

type TErrorRes = {
  status: number;
  payload: {
    message: string;
  };
};

export function defaultMutationOptions<TData = TResponse<object>, TError = TErrorRes, TVariables = unknown>(
  queryKeys?: string[][],
): UseMutationOptions<TData, TError, TVariables> {
  return {
    onError: (err) => {
      if (err instanceof Error) {
        toast.error('Something went wrong');
      } else {
        toast.error((err as TErrorRes).payload.message);
      }
    },
    onSuccess: (data) => {
      toast.success((data as TResponse<object>).message);
      const queryClient = getContext().queryClient;
      queryKeys?.forEach((queryKey) => {
        queryClient.invalidateQueries({
          queryKey,
        });
      });
    },
  };
}
