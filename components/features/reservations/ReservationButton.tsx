'use client';

import { ReservationType } from '@/app/lib/reservationsData';
import { Button } from '@/app/ui/button';
import clsx from 'clsx';

const ReservationButton = ({
  setWheel,
  isOwner,
  reservation,
  isAdmin,
}: {
  reservation: ReservationType;
  setWheel: (dialog: any) => void;
  isOwner?: boolean;
  isAdmin: boolean;
}) => {
  const { user_id, table_name, id } = reservation;
  const onButtonClick = () => {
    setWheel(reservation);
  };
  const isDisabled =
    !isAdmin && !!user_id && !!reservation.guest_name && !isOwner;

  return (
    <Button
      disabled={isDisabled}
      className={clsx('disabled:bg-gray-300 disabled:bg-opacity-50', {
        'bg-green-500 active:bg-green-600 hover:bg-green-400': isOwner,
        'bg-red-500 hover:bg-red-400 active:bg-red-600':
          isAdmin && (!!user_id || !!reservation.guest_name) && !isOwner,
      })}
      onClick={onButtonClick}
    >
      {table_name}
    </Button>
  );
};

export default ReservationButton;
