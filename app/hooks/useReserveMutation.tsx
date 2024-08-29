import { useToast } from '@/components/ui/use-toast';
import { apiFetch } from '@/utils/api';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const reserveMutation = async (reservationId: number) => {
  return apiFetch<{ status: number }>('/api/reservation', {
    method: 'PUT',
    body: { reservationId },
  });
};

const useReserveMutation = ({
  onSuccessCallback,
  weekOffset,
}: {
  onSuccessCallback?: () => void;
  weekOffset: number;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation<{ status: number }, Error, number>({
    mutationFn: (reservationId) => reserveMutation(reservationId),
    onSuccess: () => {
      toast({
        title: (
          <div className="flex items-center gap-2 text-white">
            <CheckCircleIcon width={24} height={24} />
            Reservation Successful
          </div>
        ),
        variant: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['reservations', { weekOffset }],
      });
    },
    onError: (error) => {
      toast({
        title: (
          <div className="flex items-center gap-2 text-white">
            <ExclamationCircleIcon width={24} height={24} />
            {error.message}
          </div>
        ),
        variant: 'destructive',
      });
    },
  });
};

export default useReserveMutation;
