import { Button } from '@/app/ui/button';
import { cn } from '@/lib/utils';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

const ReservationCard = () => {
  const reserved = false;
  return (
    <Card className={cn('w-[150px]')}>
      <CardHeader>
        <CardTitle>Wheel 1</CardTitle>
        <CardDescription>Reserved by John</CardDescription>
      </CardHeader>
      {/* <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Admin input will go herePush Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>
        </div>
      </CardContent> */}
      <CardFooter>
        {reserved ? (
          <Button className="w-full justify-center bg-destructive">
            Remove
          </Button>
        ) : (
          <Button className="w-full justify-center">Reserve</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReservationCard;
