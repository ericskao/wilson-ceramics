import useJoinWaitlistMutation from '@/app/hooks/reservations/useJoinWaitlistMutation';
import useLeaveWaitlistMutation from '@/app/hooks/reservations/useLeaveWaitlist';
import useWeeklyReservations from '@/app/hooks/reservations/useWeeklyReservations';
import useUser from '@/app/hooks/users/useUser';
import { Button } from '@/app/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Spinner from '@/components/ui/spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
      <ul className="flex gap-x-1">
        {matchingWaitlistRecords.map((waitlistItem) => {
          const { picture, full_name, name } = waitlistItem.raw_user_meta_data;
          const displayName = full_name || name || 'User';
          return (
            <li key={waitlistItem.user_id}>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar>
                    <AvatarImage src={picture} />
                    <AvatarFallback>
                      {displayName
                        .split(' ')
                        .map((name: string[]) => name[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{displayName}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ul>
      <div className="max-w-80">
        {waitlistPosition > -1 ? (
          <Button
            onClick={() => {
              leaveWaitlist({
                waitlistId:
                  matchingWaitlistRecords[waitlistPosition].waitlist_id,
              });
            }}
            className="mt-4"
            variant="destructive"
          >
            {isLeaving ? <Spinner /> : 'Leave Waitlist'}
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
            {isJoining ? <Spinner /> : 'Join Waitlist'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Waitlist;
