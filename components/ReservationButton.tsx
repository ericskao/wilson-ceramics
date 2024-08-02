'use client';

import { ReservationType } from '@/app/lib/reservationsData';
import { Button } from '@/app/ui/button';
import clsx from 'clsx';

const ReservationButton = ({
  setWheel,
  isOwner,
  reservation,
}: {
  reservation: ReservationType;
  setWheel: (dialog: any) => void;
  isOwner?: boolean;
}) => {
  const { user_id, table_name, id } = reservation;
  const onButtonClick = () => {
    setWheel(reservation);
  };
  return (
    <Button
      disabled={!!user_id && !isOwner}
      className={clsx('disabled:bg-gray-300 disabled:bg-opacity-50', {
        'bg-green-500 active:bg-green-600 hover:bg-green-400': isOwner,
      })}
      onClick={onButtonClick}
    >
      {table_name}
    </Button>
  );
};

export default ReservationButton;
