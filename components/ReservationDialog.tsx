import { ReservationType } from '@/app/lib/reservationsData';
import { Button } from '@/app/ui/button';
import { User } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { TimeSlotEnum } from './Reservations';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const ReservationDialog = ({
  open,
  setReservationSelected,
  reservation,
  user,
}: {
  open: boolean;
  setReservationSelected: (open: boolean) => void;
  reservation: ReservationType | null;
  user: User | null;
}) => {
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

  const onRemoveReservationClick = async () => {};

  const onReserveClick = async () => {
    const response = await fetch('/api/reservation', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reservationId: reservation.id }),
    });
    console.log('resp', response);
    if (!response.ok) {
      // If not ok, parse the error message from the response
      const errorData = await response.json();

      console.log('error data', errorData);
      throw new Error(errorData.message || 'An error occurred');
    }

    // If response is ok, parse the JSON
    const data = await response.json();
    console.log('response data:', data);

    // pop toast for success
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setReservationSelected}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reserve Wheel {reservation.table_name}</DialogTitle>
            <DialogDescription>
              {format(reservation.date, 'PPPP')}
              {' from '}
              <span className="font-semibold text-black">
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
                onClick={onRemoveReservationClick}
                type="submit"
                variant="destructive"
              >
                Remove
              </Button>
            ) : (
              <Button onClick={onReserveClick} type="submit">
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
