import { useToast } from '@/components/ui/use-toast';
import { apiFetch } from '@/utils/api';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const leaveWaitlistMutation = async ({
  waitlistId,
}: {
  waitlistId: number;
}) => {
  return apiFetch<{ status: number }>('/api/waitlist', {
    method: 'DELETE',
    body: { waitlistId },
  });
};

const useLeaveWaitlistMutation = ({
  onSuccessCallback,
  weekOffset,
}: {
  onSuccessCallback?: () => void;
  weekOffset: number;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation<{ status: number }, Error, { waitlistId: number }>({
    mutationFn: ({ waitlistId }: { waitlistId: number }) =>
      leaveWaitlistMutation({ waitlistId }),
    onSuccess: (data) => {
      toast({
        title: (
          <div className="flex items-center gap-2 text-white">
            <CheckCircleIcon width={24} height={24} />
            Removed from waitlist.
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

export default useLeaveWaitlistMutation;
