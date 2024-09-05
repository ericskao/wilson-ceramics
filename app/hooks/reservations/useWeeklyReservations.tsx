'use client';

import { apiFetch } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { ReservationType, WaitlistType } from '../lib/reservationsData';

const fetchReservations = async (
  offset: number
): Promise<ReservationType[]> => {
  const response = await apiFetch<{ data: ReservationType[] }>(
    `/api/reservations?offset=${offset}`
  );
  const reservations = await response;
  return reservations.data;
};

const fetchWaitlists = async (offset: number): Promise<WaitlistType[]> => {
  const response = await apiFetch<{ data: WaitlistType[] }>(
    `/api/waitlists?offset=${offset}`
  );
  const waitlists = await response;
  return waitlists.data;
};

const useWeeklyReservations = ({ offset = 0 }: { offset: number }) => {
  const {
    data: reservations = [],
    error,
    isFetching,
  } = useQuery({
    queryKey: ['reservations', { weekOffset: offset }],
    queryFn: () => fetchReservations(offset),
    staleTime: 120000,
  });

  const { data: waitlists = [], error: waitlistError } = useQuery({
    queryKey: ['waitlists', { weekOffset: offset }],
    queryFn: () => fetchWaitlists(offset),
    staleTime: 120000,
  });

  return {
    reservations: reservations,
    error,
    isFetching,
    waitlists,
    waitlistError,
  };
};

export default useWeeklyReservations;
