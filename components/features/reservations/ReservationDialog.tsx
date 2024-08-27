import useCancelMutation from '@/app/hooks/useCancelationMutation';
import useReserveMutation from '@/app/hooks/useReserveMutation';
import { ReservationType } from '@/app/lib/reservationsData';
import { Button } from '@/app/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { TimeSlotEnum } from './Reservations';

const ReservationDialog = ({
  open,
  setReservationSelected,
  reservation,
  user,
}: {
  open: boolean;
  setReservationSelected: Dispatch<SetStateAction<ReservationType | null>>;
  reservation: ReservationType | null;
  user: User | null;
}) => {
  const { toast } = useToast();
  const { mutate: reserve } = useReserveMutation({
    onSuccessCallback: () => setReservationSelected(null),
  });
  const { mutate: cancel } = useCancelMutation({
    onSuccessCallback: () => setReservationSelected(null),
  });

  if (!reservation) return null;
  const isOwner = reservation.user_id === user?.id;

  const reservationCopy = () => {
    if (isOwner) {
      return <p>You have reserved this wheel.</p>;
    } else if (reservation.user_id) {
      return <p>{reservation.guest_name} has reserved this wheel.</p>;
    } else {
      return <p>No one has reserved this wheel yet.</p>;
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={() => setReservationSelected(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reserve Wheel {reservation.table_name}</DialogTitle>
            <DialogDescription>
              {format(reservation.date, 'PPPP')}
              {' from '}
              <span className="font-semibold text-black text-lg">
                {TimeSlotEnum[reservation.time_slot_id as 1 | 2 | 3]}
              </span>
            </DialogDescription>
          </DialogHeader>
          {reservationCopy()}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" type="submit">
                Cancel
              </Button>
            </DialogClose>
            {isOwner ? (
              <Button
                onClick={() => cancel(reservation.id)}
                type="submit"
                variant="destructive"
              >
                Remove
              </Button>
            ) : (
              <Button onClick={() => reserve(reservation.id)} type="submit">
                Reserve
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationDialog;
