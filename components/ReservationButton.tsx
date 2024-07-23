'use client';

import { Button } from '@/app/ui/button';

const ReservationButton = ({
  reserved,
  number,
  setWheel,
}: {
  reserved?: boolean;
  number: number;
  setWheel: (dialog: any) => void;
}) => {
  const onButtonClick = () => {
    setWheel(number);
  };
  return (
    <Button
      disabled={reserved}
      className="disabled:bg-gray-300 disabled:bg-opacity-50"
      onClick={onButtonClick}
    >
      {number}
    </Button>
  );
};

export default ReservationButton;
