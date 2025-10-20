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
    queryFn: apiClient.getBalance,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: UserUpdateInput) => apiClient.updateProfile(updateData),
    onSuccess: (updatedUser: User) => {
      // Update the profile cache
      queryClient.setQueryData(['profile'], updatedUser);
      
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
