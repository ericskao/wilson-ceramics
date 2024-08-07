'use client';

import useUser from '@/app/hooks/useUser';
import { ReservationType } from '@/app/lib/reservationsData';
import ReservationDialog from '@/components/ReservationDialog';
import { useState } from 'react';
import ReservationButton from './ReservationButton';

export const TimeSlotEnum = {
  1: '4-6pm',
  2: '6-8pm',
  3: '8-10pm',
};

const Reservations = ({
  reservations,
}: {
  reservations: ReservationType[];
}) => {
  const [reservationSelected, setReservationSelected] =
    useState<ReservationType | null>(null);
  const { user } = useUser();

  const reservationsByTimeSlotId = reservations.reduce((acc, reservation) => {
    const timeKey = TimeSlotEnum[reservation.time_slot_id as 1 | 2 | 3];
    if (!acc[timeKey]) {
      acc[timeKey] = [];
    }
    acc[timeKey].push(reservation);
    return acc;
  }, {} as { [key: string]: ReservationType[] });

  return (
    <div className="flex flex-col gap-y-12">
      {Object.keys(reservationsByTimeSlotId).map((timeSlotId) => {
        return (
          <div key={timeSlotId}>
            <div>{timeSlotId}</div>
            <ul className="p-2 gap-3 flex flex-wrap">
              {reservationsByTimeSlotId[timeSlotId.toString()].map(
                (reservation) => (
                  <li key={reservation.id}>
                    <ReservationButton
                      setWheel={setReservationSelected}
                      reservation={reservation}
                      isOwner={reservation.user_id === user.id}
                    />
                  </li>
                )
              )}
            </ul>
          </div>
        );
      })}
      <ReservationDialog
        open={!!reservationSelected}
        setReservationSelected={() => setReservationSelected(null)}
        reservation={reservationSelected}
        user={user}
      />
    </div>
  );
};

export default Reservations;
