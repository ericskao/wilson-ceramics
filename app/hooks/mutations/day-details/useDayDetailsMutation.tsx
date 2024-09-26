import { useToast } from '@/components/ui/use-toast';
import { apiFetch } from '@/utils/api';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const updateDayDetails = async ({
  link,
  note,
  date,
}: {
  link?: string;
  note?: string;
  date: string;
}) => {
  return apiFetch<{ status: number }>(`/api/day-detail`, {
    method: 'PUT',
    body: {
      date,
      note,
      link,
    },
  });
};

const useDayDetailsMutation = ({
  closeDialog,
  weekOffset,
}: {
  weekOffset: number;
  closeDialog: () => void;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      link,
      note,
      date,
    }: {
      link?: string;
      note?: string;
      date: string;
    }) => updateDayDetails({ link, note, date }),
    onSuccess: () => {
      // TODO maybe consider rewriting cache directly
      queryClient.invalidateQueries({
        queryKey: ['dayDetails', { weekOffset }],
      });
      toast({
        title: (
          <div className="flex items-center gap-2 text-white">
            <CheckCircleIcon width={24} height={24} />
            Details saved!
          </div>
        ),
        variant: 'success',
      });
      closeDialog();
    },
    onError: (e) => {
      toast({
        title: (
          <div className="flex items-center gap-2 text-white">
            <ExclamationCircleIcon width={24} height={24} />
            {e.message ||
              'Unable to save details. Please try again or contact support.'}
          </div>
        ),
        variant: 'destructive',
      });
    },
  });
};

export default useDayDetailsMutation;
