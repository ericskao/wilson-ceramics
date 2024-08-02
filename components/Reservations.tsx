'use client';

import { ReservationType } from '@/app/lib/reservationsData';
import ReservationButton from '@/components/ReservationButton';
import ReservationDialog from '@/components/ReservationDialog';
import { useState } from 'react';

const Reservations = ({
  reservations,
}: {
  reservations: ReservationType[];
}) => {
  const [reservationSelected, setReservationSelected] =
    useState<ReservationType | null>(null);
  const userId = 2;

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <div className="mb-4">Friday</div>
          <div>
            <div>4-6pm</div>
            <ul className="p-2 gap-3 flex flex-wrap">
              {reservations.map((reservation) => (
                <li key={reservation.id}>
                  <ReservationButton
                    setWheel={setReservationSelected}
                    reservation={reservation}
                    isOwner={reservation.id === userId}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div>Saturday</div>
        </div>
      </div>
      <ReservationDialog
        open={!!reservationSelected}
        setReservationSelected={() => setReservationSelected(null)}
        reservation={reservationSelected}
      />
    </div>
  );
};

export default Reservations;
