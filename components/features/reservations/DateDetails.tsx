import { DayDetailType } from '@/app/lib/reservationsData';
import { formatPST } from '@/utils/date';
import Link from 'next/link';

const DateDetails = ({
  date,
  dateDetails,
  isAdmin,
}: {
  date: string;
  dateDetails?: DayDetailType;
  isAdmin: boolean;
}) => {
  if (!dateDetails) return null;
  return (
    <div className="py-3">
      {dateDetails.link && (
        <div>
          <Link
            target="_blank"
            className="text-blue-500 font-bold"
            href={dateDetails.link}
          >
            Open Studio Drop-in Registration Link ({formatPST(date, 'MM/dd/yy')}
            )
          </Link>
        </div>
      )}
      {dateDetails.note && <p>{dateDetails.note}</p>}
    </div>
  );
};

export default DateDetails;
