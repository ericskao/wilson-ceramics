import useJoinWaitlistMutation from '@/app/hooks/reservations/useJoinWaitlistMutation';
import useLeaveWaitlistMutation from '@/app/hooks/reservations/useLeaveWaitlist';
import useWeeklyReservations from '@/app/hooks/reservations/useWeeklyReservations';
import useUser from '@/app/hooks/users/useUser';
import { Button } from '@/app/ui/button';

const Waitlist = ({
  weekOffset,
  timeSlotId,
  date,
}: {
  weekOffset: number;
  timeSlotId: string;
  date: string;
}) => {
  const { user } = useUser();
  const { mutate: joinWaitlist, isPending: isJoining } =
    useJoinWaitlistMutation({
      weekOffset,
    });
  const { mutate: leaveWaitlist, isPending: isLeaving } =
    useLeaveWaitlistMutation({
      weekOffset,
    });
  const { waitlists } = useWeeklyReservations({
    offset: weekOffset,
  });

  const matchingWaitlistRecords = waitlists.filter(
    (waitlist) =>
      waitlist.date === date && waitlist.time_slot_id == Number(timeSlotId)
  );
  const waitlistPosition = matchingWaitlistRecords.findIndex(
    (record) => record.user_id === user.id
  );

  return (
    <div className="pt-2 px-2">
      <span className="font-medium">Waitlist</span>
      <ul>
        {matchingWaitlistRecords.map((waitlistItem) => (
          <li>{waitlistItem.user_id}</li>
        ))}
      </ul>
      {waitlistPosition > -1 ? (
        <Button
          onClick={() => {
            leaveWaitlist({
              waitlistId: matchingWaitlistRecords[waitlistPosition].waitlist_id,
            });
          }}
          className="mt-4"
          variant="destructive"
        >
          {isLeaving ? 'Leaving...' : 'Leave Waitlist'}
        </Button>
      ) : (
        <Button
          onClick={() => {
            joinWaitlist({
              timeSlotId: Number(timeSlotId),
              date,
            });
          }}
          className="mt-4"
          variant="secondary"
        >
          {isJoining ? 'Joining...' : 'Join Waitlist'}
        </Button>
      )}
    </div>
  );
};

export default Waitlist;
