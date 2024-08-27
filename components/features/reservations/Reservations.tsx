'use client';

import useUser from '@/app/hooks/useUser';
import useWeeklyReservations from '@/app/hooks/useWeeklyReservations';
import { ReservationType } from '@/app/lib/reservationsData';
import { format, parseISO } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import ReservationButton from './ReservationButton';
import ReservationDialog from './ReservationDialog';

export const TimeSlotEnum = {
  1: '4-6pm',
  2: '6-8pm',
  3: '8-10pm',
};

const Reservations = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [reservationSelected, setReservationSelected] =
    useState<ReservationType | null>(null);

  const { user } = useUser();
  const { reservations, isFetching, error } = useWeeklyReservations({
    offset: 0,
  });

  const reservationsByTimeSlotId = useMemo(() => {
    return reservations.reduce((acc, reservation) => {
      const timeKey = TimeSlotEnum[reservation.time_slot_id as 1 | 2 | 3];
      if (!acc[timeKey]) {
        acc[timeKey] = [];
      }
      acc[timeKey].push(reservation);
      return acc;
    }, {} as { [key: string]: ReservationType[] });
  }, [reservations]);

  const reservationsByDate = useMemo(() => {
    if (!reservations) return {};
    return reservations.reduce((acc, reservation) => {
      const date = reservation.date as string;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(reservation);
      return acc;
    }, {} as { [key: string]: ReservationType[] });
  }, [reservations]);

  const handleReservationSelected = useCallback(
    (reservation: ReservationType | null) => {
      setReservationSelected(reservation);
    },
    []
  );

  if (isFetching) {
    // TODO add skeleton
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-y-12">
      {Object.keys(reservationsByDate).map((date) => {
        return (
          <div>
            <h2 className="text-xl py-8">{format(parseISO(date), 'PPPP')}</h2>
            {Object.keys(reservationsByTimeSlotId).map((timeSlotId) => {
              return (
                <div key={timeSlotId}>
                  <div>{timeSlotId}</div>
                  <ul className="p-2 gap-3 flex flex-wrap">
                    {reservationsByTimeSlotId[timeSlotId.toString()].map(
                      (reservation) => (
                        <li key={reservation.id}>
                          <ReservationButton
                            setWheel={handleReservationSelected}
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
          </div>
        );
      })}

      <ReservationDialog
        open={!!reservationSelected}
        setReservationSelected={setReservationSelected}
        reservation={reservationSelected}
        user={user}
      />
    </div>
  );
};

export default Reservations;
