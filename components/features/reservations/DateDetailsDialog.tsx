import useDayDetailsMutation from '@/app/hooks/mutations/day-details/useDayDetailsMutation';
import { DayDetailType } from '@/app/lib/reservationsData';
import { Button } from '@/app/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { formatPST } from '@/utils/date';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const DateDetailsDialog = ({
  date,
  weekOffset,
  open,
  onOpenChange,
  dateDetails,
}: {
  date: string;
  weekOffset: number;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  dateDetails?: DayDetailType;
}) => {
  const [link, setLink] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const { mutate, isPending } = useDayDetailsMutation({
    weekOffset,
    closeDialog: () => {
      onOpenChange(false);
    },
  });

  useEffect(() => {
    setNote(dateDetails?.note || '');
    setLink(dateDetails?.link || '');
  }, [dateDetails]);

  const handleClose = () => {
    setTimeout(() => {
      setNote(dateDetails?.note || '');
      setLink(dateDetails?.link || '');
    }, 500);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        } else {
          onOpenChange(true);
        }
      }}
    >
      <DialogTrigger>
        <Button variant="tertiary">
          <PencilIcon width={20} height={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pb-2">
          <DialogTitle>{formatPST(date)}</DialogTitle>
          <DialogDescription>
            Add or update details for this day
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-2">
          <Label>Registration Link</Label>
          <Input
            value={link}
            onChange={(e) => setLink(e.currentTarget.value)}
            placeholder="Add studio drop-in link here"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>Announcements</Label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.currentTarget.value)}
          />
        </div>
        <DialogFooter className="pt-4">
          <Button onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={isPending}
            onClick={() => {
              mutate({ link, note, date });
            }}
          >
            {isPending ? <Spinner /> : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DateDetailsDialog;
