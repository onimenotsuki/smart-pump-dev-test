import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { User, UserUpdateInput } from '../types';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: apiClient.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBalance = () => {
  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      console.log('Fetching balance...');
      try {
        const result = await apiClient.getBalance();
        console.log('Balance fetched successfully:', result);
        return result;
      } catch (error) {
        console.error('Error fetching balance:', error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    retry: 3,
  });
};

export const useRefreshBalance = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['balance'] });
  };
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: UserUpdateInput) =>
      apiClient.updateProfile(updateData),
    onSuccess: (updatedUser: User) => {
      // Update the profile cache
      queryClient.setQueryData(['profile'], updatedUser);

      // Invalidate and refetch profile to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      // Update user in auth context
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUserData = { ...user, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
      }
    },
  });
};
