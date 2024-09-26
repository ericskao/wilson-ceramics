import { useToast } from '@/components/ui/use-toast';
import { apiFetch } from '@/utils/api';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const joinWaitlistMutation = async ({
  timeSlotId,
  date,
}: {
  timeSlotId: number;
  date: string;
}) => {
  return apiFetch<{ status: number }>('/api/waitlist', {
    method: 'POST',
    body: { timeSlotId, date },
  });
};

const useJoinWaitlistMutation = ({
  onSuccessCallback,
  weekOffset,
}: {
  onSuccessCallback?: () => void;
  weekOffset: number;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation<
    { status: number },
    Error,
    { timeSlotId: number; date: string }
  >({
    mutationFn: ({ timeSlotId, date }: { timeSlotId: number; date: string }) =>
      joinWaitlistMutation({ timeSlotId, date }),
    onSuccess: (data) => {
      toast({
        title: (
          <div className="flex items-center gap-2 text-white">
            <CheckCircleIcon width={24} height={24} />
            Joined Waitlist!
          </div>
        ),
        variant: 'success',
      });
      onSuccessCallback?.();
      queryClient.invalidateQueries({
        queryKey: ['waitlists', { weekOffset }],
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

export default useJoinWaitlistMutation;
