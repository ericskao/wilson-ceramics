import { apiFetch } from '@/utils/api';
import { User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

export enum UserRoles {
  'ADMIN' = 'service_role',
}

const fetchUser = async (): Promise<User | null> => {
  const response = await apiFetch<User | null>('/api/user');
  return response;
};

const useUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetchUser(),
  });

  const name =
    data?.user_metadata?.name ||
    data?.user_metadata?.full_name ||
    data?.user_metadata?.email;

  return { user: data || ({} as User), isLoading, name };
};

export default useUser;
