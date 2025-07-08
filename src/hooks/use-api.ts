import { useState, useEffect, useCallback } from "react";
import { apiService } from "@/lib/api-service";
import { toast } from "@/hooks/use-toast";

// Generic hook for API calls with loading states and error handling
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    immediate?: boolean;
    showErrorToast?: boolean;
    showSuccessToast?: boolean;
    successMessage?: string;
  } = {},
) {
  const {
    immediate = true,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);

      if (showSuccessToast && successMessage) {
        toast({
          title: "Éxito",
          description: successMessage,
        });
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);

      if (showErrorToast) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, showErrorToast, showSuccessToast, successMessage]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
}

// Specific hooks for common API operations

export function useUsers() {
  return useApi(() => apiService.getUsers(), [], {
    showErrorToast: true,
  });
}

export function useAccommodations() {
  return useApi(() => apiService.getAccommodations(), [], {
    showErrorToast: true,
  });
}

export function useReservations(isAdmin: boolean = false) {
  return useApi(() => apiService.getReservations(isAdmin), [isAdmin], {
    showErrorToast: true,
  });
}

export function useNotifications() {
  return useApi(() => apiService.getNotifications(), [], {
    showErrorToast: false, // Notifications should fail silently
  });
}

export function useContactMessages(
  page: number = 1,
  limit: number = 10,
  filters: {
    status?: string;
    department?: string;
    priority?: string;
  } = {},
) {
  return useApi(
    () =>
      apiService.getContactMessages(
        page,
        limit,
        filters.status,
        filters.department,
        filters.priority,
      ),
    [page, limit, filters.status, filters.department, filters.priority],
    {
      showErrorToast: true,
    },
  );
}

export function useRegistrationRequests() {
  return useApi(() => apiService.getRegistrationRequests(), [], {
    showErrorToast: true,
  });
}

export function useUserStats() {
  return useApi(() => apiService.getUserStats(), [], {
    showErrorToast: false,
  });
}

export function useReservationStats() {
  return useApi(() => apiService.getReservationStats(), [], {
    showErrorToast: false,
  });
}

export function useContactStats() {
  return useApi(() => apiService.getContactStats(), [], {
    showErrorToast: false,
  });
}

// Mutation hooks for create/update/delete operations
export function useApiMutation<TParams, TResult>(
  apiCall: (params: TParams) => Promise<TResult>,
  options: {
    showErrorToast?: boolean;
    showSuccessToast?: boolean;
    successMessage?: string;
    onSuccess?: (result: TResult) => void;
    onError?: (error: Error) => void;
  } = {},
) {
  const {
    showErrorToast = true,
    showSuccessToast = true,
    successMessage = "Operación completada exitosamente",
    onSuccess,
    onError,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (params: TParams) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall(params);

        if (showSuccessToast) {
          toast({
            title: "Éxito",
            description: successMessage,
          });
        }

        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);

        if (showErrorToast) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }

        onError?.(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [
      apiCall,
      showErrorToast,
      showSuccessToast,
      successMessage,
      onSuccess,
      onError,
    ],
  );

  return {
    mutate,
    loading,
    error,
  };
}

// Specific mutation hooks
export function useCreateReservation(onSuccess?: () => void) {
  return useApiMutation(
    (reservationData: any) => apiService.createReservation(reservationData),
    {
      successMessage: "Reserva creada exitosamente",
      onSuccess,
    },
  );
}

export function useUpdateReservation(onSuccess?: () => void) {
  return useApiMutation(
    ({ id, data }: { id: string; data: any }) =>
      apiService.updateReservation(id, data),
    {
      successMessage: "Reserva actualizada exitosamente",
      onSuccess,
    },
  );
}

export function useUpdateUser(onSuccess?: () => void) {
  return useApiMutation(
    ({ id, data }: { id: string; data: any }) =>
      apiService.updateUser(id, data),
    {
      successMessage: "Usuario actualizado exitosamente",
      onSuccess,
    },
  );
}

export function useActivateUser(onSuccess?: () => void) {
  return useApiMutation((userId: string) => apiService.activateUser(userId), {
    successMessage: "Usuario activado exitosamente",
    onSuccess,
  });
}

export function useDeactivateUser(onSuccess?: () => void) {
  return useApiMutation((userId: string) => apiService.deactivateUser(userId), {
    successMessage: "Usuario desactivado exitosamente",
    onSuccess,
  });
}

export function useApproveRegistrationRequest(onSuccess?: () => void) {
  return useApiMutation(
    ({ id, notes }: { id: string; notes?: string }) =>
      apiService.approveRegistrationRequest(id, notes),
    {
      successMessage: "Solicitud aprobada exitosamente",
      onSuccess,
    },
  );
}

export function useRejectRegistrationRequest(onSuccess?: () => void) {
  return useApiMutation(
    ({
      id,
      rejectionReason,
      notes,
    }: {
      id: string;
      rejectionReason: string;
      notes?: string;
    }) => apiService.rejectRegistrationRequest(id, rejectionReason, notes),
    {
      successMessage: "Solicitud rechazada exitosamente",
      onSuccess,
    },
  );
}

export function useSendContactMessage(onSuccess?: () => void) {
  return useApiMutation(
    (messageData: any) => apiService.sendContactMessage(messageData),
    {
      successMessage: "Mensaje enviado exitosamente",
      onSuccess,
    },
  );
}

export function useUpdateContactMessage(onSuccess?: () => void) {
  return useApiMutation(
    ({ id, data }: { id: string; data: any }) =>
      apiService.updateContactMessage(id, data),
    {
      successMessage: "Mensaje actualizado exitosamente",
      onSuccess,
    },
  );
}
