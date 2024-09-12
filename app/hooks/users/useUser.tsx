import { apiFetch } from '@/utils/api';
import { User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

export enum UserRoles {
  'ADMIN' = 'service_role',
}

const fetchUser = async (): Promise<User> => {
  return await apiFetch<User>('/api/user');
};

const useUser = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetchUser(),
  });

  const name =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.email;

  return { user, isLoading, name };
};

export default useUser;
