'use client';

import { apiFetch } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { ReservationType } from '../lib/reservationsData';

const fetchReservations = async (
  offset: number
): Promise<ReservationType[]> => {
  const response = await apiFetch<{ data: ReservationType[] }>(
    `/api/reservations?offset=${offset}`
  );
  const reservations = await response;
  return reservations.data;
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

  return { reservations: reservations, error, isFetching };
};

export default useWeeklyReservations;
