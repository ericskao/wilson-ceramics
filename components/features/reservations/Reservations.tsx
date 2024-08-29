'use client';

import useUser from '@/app/hooks/useUser';
import useWeeklyReservations from '@/app/hooks/useWeeklyReservations';
import { ReservationType } from '@/app/lib/reservationsData';
import { Button } from '@/app/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { add, format, parseISO, startOfWeek } from 'date-fns';
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
    offset: weekOffset,
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
    <div>
      <div className="flex flex-row">
        <div>
          <Button
            disabled={weekOffset === 0}
            variant="tertiary"
            onClick={() => {
              if (weekOffset > 0) {
                setWeekOffset(weekOffset - 1);
              }
            }}
          >
            <ChevronLeftIcon width={28} height={28} />
          </Button>
        </div>
        <div className="flex-1 text-center text-3xl font-medium">
          Week of{' '}
          {format(
            add(startOfWeek(new Date()), {
              weeks: weekOffset,
              days: 1,
            }),
            'PPP'
          )}
        </div>
        <div className="">
          <Button
            disabled={weekOffset === 2}
            variant="tertiary"
            onClick={() => {
              if (weekOffset < 2) {
                setWeekOffset(weekOffset + 1);
              }
            }}
          >
            <ChevronRightIcon width={28} height={28} />
          </Button>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col gap-y-12 flex-1 min-w-[45%]">
          {Object.keys(reservationsByDate).map((date) => {
            return (
              <div key={date}>
                <h2 className="text-lg py-8">
                  {format(parseISO(date), 'PPPP')}
                </h2>
                <div className="flex flex-col gap-y-6">
                  {Object.keys(reservationsByTimeSlotId).map((timeSlotId) => {
                    return (
                      <div key={timeSlotId}>
                        <div className="text-lg font-semibold">
                          {timeSlotId}
                        </div>
                        <ul className="p-2 gap-3 flex flex-wrap">
                          {reservationsByTimeSlotId[timeSlotId.toString()]
                            .toSorted((a, b) => a.id - b.id)
                            .map((reservation) => (
                              <li key={reservation.id}>
                                <ReservationButton
                                  setWheel={handleReservationSelected}
                                  reservation={reservation}
                                  isOwner={reservation.user_id === user.id}
                                />
                              </li>
                            ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex-1 min-w-[45%] invisible">second col</div>
      </div>
      <ReservationDialog
        open={!!reservationSelected}
        setReservationSelected={setReservationSelected}
        reservation={reservationSelected}
        user={user}
        weekOffset={weekOffset}
      />
    </div>
  );
};

export default Reservations;
