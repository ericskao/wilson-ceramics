import { ReservationType } from '@/app/lib/reservationsData';
import { Button } from '@/app/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const ReservationDialog = ({
  open,
  setReservationSelected,
  reservation,
}: {
  open: boolean;
  setReservationSelected: (open: boolean) => void;
  reservation: ReservationType | null;
}) => {
  if (!reservation) return null;
  const isOwner = reservation.user_id === 4;
  return (
    <div>
      <Dialog open={open} onOpenChange={setReservationSelected}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reserve Wheel {reservation.id}</DialogTitle>
            <DialogDescription>
              Friday, {new Date().toLocaleDateString()} at 4-6pm
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">This wheel is available.</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" type="submit">
                Cancel
              </Button>
            </DialogClose>
            {isOwner ? (
              <Button type="submit" variant="destructive">
                Remove
              </Button>
            ) : (
              <Button type="submit">Reserve</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationDialog;
