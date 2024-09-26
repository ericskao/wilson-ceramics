import useCancelMutation from '@/app/hooks/mutations/reservations/useCancelationMutation';
import useReserveMutation from '@/app/hooks/mutations/reservations/useReserveMutation';
import { UserRoles } from '@/app/hooks/users/useUser';
import { ReservationType } from '@/app/lib/reservationsData';
import { Button } from '@/app/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';
import { formatPST } from '@/utils/date';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import { Dispatch, SetStateAction, useState } from 'react';
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
  weekOffset,
}: {
  open: boolean;
  setReservationSelected: Dispatch<SetStateAction<ReservationType | null>>;
  reservation: ReservationType | null;
  user: User | null;
  weekOffset: number;
}) => {
  const [guestName, setGuestName] = useState('');

  // TODO should handle front end validation for reserving (ie cant reserve if already reserved on the same timeSlot)
  const { mutate: reserve, isPending: isReserving } = useReserveMutation({
    onSuccessCallback: () => {
      setGuestName('');
      setReservationSelected(null);
    },
    weekOffset,
  });
  const { mutate: cancel, isPending: isCanceling } = useCancelMutation({
    onSuccessCallback: () => {
      setGuestName('');
      setReservationSelected(null);
    },
    weekOffset,
  });

  if (!reservation) return null;

  const isOwner = reservation.user_id === user?.id;
  const isAdmin = user?.role === UserRoles.ADMIN;
  const adminReservation = !reservation.user_id && reservation.guest_name;

  const reservationCopy = () => {
    if (isOwner) {
      return <p>You have reserved this wheel.</p>;
    } else if (reservation.user_id || reservation.guest_name) {
      return (
        <p>
          {reservation.guest_name} has reserved this wheel.{' '}
          {adminReservation && (
            <div className="text-xs italic text-secondary-foreground">
              - This reservation was manually set by an admin
            </div>
          )}
        </p>
      );
    } else {
      return <p>No one has reserved this wheel yet.</p>;
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={() => setReservationSelected(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Wheel {reservation.table_name}</DialogTitle>
            <DialogDescription>
              {formatPST(reservation.date)}
              {' from '}
              <span className="font-semibold text-black text-lg">
                {TimeSlotEnum[reservation.time_slot_id as 1 | 2 | 3]}
              </span>
            </DialogDescription>
          </DialogHeader>
          {reservationCopy()}
          {isAdmin && (
            <Accordion type="single" collapsible>
              <AccordionItem value="admin-actions">
                <AccordionTrigger>Admin Options</AccordionTrigger>
                <AccordionContent className="px-2">
                  {reservation.user_id || reservation.guest_name ? (
                    <Button
                      variant="destructive"
                      onClick={() => cancel(reservation.id)}
                    >
                      Remove Reservation
                    </Button>
                  ) : (
                    <div className="flex items-center mb-2">
                      <Input
                        className="w-full h-10"
                        placeholder="Set guest name"
                        onChange={(e) => {
                          setGuestName(e.currentTarget.value);
                        }}
                        value={guestName}
                      />
                      <div>
                        <Button
                          variant="ghost"
                          onClick={() => setGuestName('')}
                        >
                          <XMarkIcon height={16} width={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
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
                disabled={isCanceling}
              >
                {isCanceling ? <Spinner /> : 'Remove'}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (guestName && isAdmin) {
                    reserve({ reservationId: reservation.id, guestName });
                  } else {
                    reserve({ reservationId: reservation.id });
                  }
                }}
                type="submit"
                disabled={
                  isReserving ||
                  (isAdmin && !!reservation.user_id) ||
                  (!reservation.user_id && !!reservation.guest_name)
                }
              >
                {isReserving ? <Spinner /> : 'Reserve'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationDialog;
