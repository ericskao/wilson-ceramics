'use client';

import { Button } from '@/app/ui/button';
import clsx from 'clsx';

const ReservationButton = ({
  reserved,
  number,
  setWheel,
  isOwner,
}: {
  reserved?: boolean;
  number: number;
  setWheel: (dialog: any) => void;
  isOwner?: boolean;
}) => {
  const onButtonClick = () => {
    setWheel(number);
  };
  return (
    <Button
      disabled={reserved && !isOwner}
      className={clsx('disabled:bg-gray-300 disabled:bg-opacity-50', {
        'bg-green-500 active:bg-green-600 hover:bg-green-400': isOwner,
      })}
      onClick={onButtonClick}
    >
      {number}
    </Button>
  );
};

export default ReservationButton;
