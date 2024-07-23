'use client';

import ReservationButton from '@/components/ReservationButton';
import ReservationDialog from '@/components/ReservationDialog';
import { useState } from 'react';

const Reservations = () => {
  const [wheel, setWheel] = useState<any>(null);
  const reservations = [
    {
      number: 5,
      reserved: true,
    },
    {
      number: 6,
      reserved: false,
    },
    {
      number: 7,
      reserved: false,
    },
    {
      number: 8,
      reserved: false,
    },
    {
      number: 9,
      reserved: false,
    },
    {
      number: 10,
      reserved: true,
    },
    {
      number: 11,
      reserved: false,
    },
    {
      number: 12,
      reserved: true,
    },
    {
      number: 13,
      reserved: true,
    },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <div className="mb-4">Friday</div>
          <div>
            <div>4-6pm</div>
            <ul className="p-2 gap-3 flex flex-wrap">
              <li>
                <ReservationButton setWheel={setWheel} number={1} />
              </li>
              <li>
                <ReservationButton setWheel={setWheel} number={2} reserved />
              </li>
              <li>
                <ReservationButton setWheel={setWheel} number={3} />
              </li>
              <li>
                <ReservationButton
                  setWheel={setWheel}
                  number={4}
                  reserved
                  isOwner={true}
                />
              </li>
              {reservations.map((reservation) => (
                <li key={reservation.number}>
                  <ReservationButton
                    setWheel={setWheel}
                    number={reservation.number}
                    reserved={reservation.reserved}
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
      <ReservationDialog open={!!wheel} setOpen={setWheel} wheel={wheel} />
    </div>
  );
};

export default Reservations;
