import { useToast } from '@/components/ui/use-toast';
import { apiFetch } from '@/utils/api';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const cancelMutation = async (reservationId: number) => {
  return apiFetch<{ status: number }>('/api/reservation', {
    method: 'PUT',
    body: { reservationId, status: 'canceled' },
  });
};

const useCancelMutation = ({
  onSuccessCallback,
  weekOffset,
}: {
  onSuccessCallback?: () => void;
  weekOffset: number;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<{ status: number }, Error, number>({
    mutationFn: (reservationId) => cancelMutation(reservationId),
    onSuccess: (data) => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['reservations', { weekOffset }],
        }),
        queryClient.invalidateQueries({
          queryKey: ['waitlists', { weekOffset }],
        }),
      ]);
      toast({
        title: (
          <div className="flex items-center gap-2 text-white">
            <CheckCircleIcon width={24} height={24} />
            Reservation successfully canceled.
          </div>
        ),
        variant: 'success',
      });
      onSuccessCallback?.();
    },
    onError: (e) => {
      toast({
        title: (
          <div className="flex items-center gap-2 text-white">
            <ExclamationCircleIcon width={24} height={24} />
            {e.message ||
              'Unable to cancel reservation. Please try again or contact support.'}
          </div>
        ),
        variant: 'destructive',
      });
    },
  });
};

export default useCancelMutation;
