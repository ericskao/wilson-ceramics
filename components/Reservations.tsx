'use client';

import ReservationButton from '@/components/ReservationButton';
import ReservationDialog from '@/components/ReservationDialog';
import { useState } from 'react';

const Reservations = () => {
  const [wheel, setWheel] = useState<any>(null);

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
                <ReservationButton setWheel={setWheel} number={4} reserved />
              </li>
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
