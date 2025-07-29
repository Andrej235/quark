import { ApiResponse } from "@/api-dsl/types/endpoints/response-parser";
import { toast } from "sonner";

export function apiResponseToToast(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: Promise<ApiResponse<any, any>>,
  options: {
    loading?: string;
    success?: string;
    error?: (error: Error) => string;
  },
): void {
  toast.promise(
    response.then((response) => {
      if (!response?.isOk) throw new Error(response?.error?.message);
    }),
    {
      loading: options.loading || "Please wait...",
      success: options.success || "Success",
      error: options.error || ((x) => (x as Error).message),
    },
  );
}
