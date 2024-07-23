import { Button } from '@/app/ui/button';
import { Dispatch } from 'react';
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
  setOpen,
  wheel,
}: {
  open: boolean;
  setOpen: Dispatch<boolean>;
  wheel: any;
}) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reserve Wheel {wheel}</DialogTitle>
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
            <Button type="submit">Reserve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationDialog;
