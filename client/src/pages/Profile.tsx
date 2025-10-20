import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import {
  useProfile,
  useBalance,
  useUpdateProfile,
  useRefreshBalance,
} from '../hooks/useApi';
import { UserUpdateInput } from '../types';
import Logo from '../components/Logo';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const {
    data: balance,
    isLoading: balanceLoading,
    isFetching: balanceFetching,
    error: balanceError,
  } = useBalance();

  // Debug logging for balance
  useEffect(() => {
    console.log('Profile: Balance state:', {
      balance,
      balanceLoading,
      balanceFetching,
      balanceError,
    });
  }, [balance, balanceLoading, balanceFetching, balanceError]);
  const updateProfileMutation = useUpdateProfile();
  const refreshBalance = useRefreshBalance();
  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserUpdateInput>();

  // Reset form when profile data loads or changes
  useEffect(() => {
    if (profile) {
      console.log('Resetting form with profile data:', profile);
      reset({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        company: profile.company,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: UserUpdateInput) => {
    try {
      setUpdateMessage(null);
      console.log('Submitting profile update:', data);
      await updateProfileMutation.mutateAsync(data);
      setIsEditing(false);
      setUpdateMessage({
        type: 'success',
        message: 'Profile updated successfully!',
      });
      // Clear message after 3 seconds
      setTimeout(() => setUpdateMessage(null), 3000);
    } catch (error) {
      console.error('Update failed:', error);
      setUpdateMessage({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to update profile',
      });
    }
  };

  const handleCancel = () => {
    if (profile) {
      reset({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        company: profile.company,
      });
    }
    setIsEditing(false);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const currentUser = profile || user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {currentUser?.name.first} {currentUser?.name.last}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-smart-blue to-smart-dark p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {currentUser?.name.first[0]}
                    {currentUser?.name.last[0]}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    {currentUser?.name.first} {currentUser?.name.last}
                  </h1>
                  <p className="text-blue-100">{currentUser?.email}</p>
                  <p className="text-blue-100">{currentUser?.company}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Current Balance</p>
                <p className="text-2xl font-bold">
                  {balanceLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Loading...
                    </div>
                  ) : balanceError ? (
                    <div className="text-red-200 text-sm">Error</div>
                  ) : (
                    balance?.balance || 'N/A'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Balance Display */}
          <div className="p-6 border-b border-gray-200">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    Account Balance
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    {balanceLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
                        Loading...
                      </div>
                    ) : balanceError ? (
                      <div className="text-red-500 text-sm">
                        Error loading balance
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {balance?.balance || 'N/A'}
                        {balanceFetching && (
                          <div className="ml-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </p>
                </div>
                <div className="text-green-500">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex-1 bg-smart-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-smart-dark transition-colors"
              >
                {isEditing ? 'Cancel Edit' : 'EDIT'}
              </button>
              <button
                onClick={refreshBalance}
                disabled={balanceFetching}
                className="flex-1 bg-green-100 text-green-700 py-3 px-6 rounded-lg font-medium hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {balanceFetching ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                    Refreshing...
                  </div>
                ) : (
                  'REFRESH BALANCE'
                )}
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Success/Error Message */}
                {updateMessage && (
                  <div
                    className={`p-4 rounded-lg ${
                      updateMessage.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}
                  >
                    <p className="text-sm font-medium">
                      {updateMessage.message}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      {...register('name.first', {
                        required: 'First name is required',
                      })}
                      defaultValue={currentUser?.name.first || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.name?.first && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.first.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      {...register('name.last', {
                        required: 'Last name is required',
                      })}
                      defaultValue={currentUser?.name.last || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.name?.last && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.last.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      value={currentUser?.email || ''}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      placeholder="Email cannot be changed"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email address cannot be modified
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      {...register('phone')}
                      defaultValue={currentUser?.phone || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      {...register('company')}
                      defaultValue={currentUser?.company || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      {...register('address')}
                      rows={3}
                      defaultValue={currentUser?.address || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || updateProfileMutation.isPending}
                    className="bg-smart-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-smart-dark transition-colors disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending
                      ? 'Saving...'
                      : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </h3>
                    <p className="text-lg text-gray-900">
                      {currentUser?.name.first} {currentUser?.name.last}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Email
                    </h3>
                    <p className="text-lg text-gray-900">
                      {currentUser?.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Phone
                    </h3>
                    <p className="text-lg text-gray-900">
                      {currentUser?.phone}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Company
                    </h3>
                    <p className="text-lg text-gray-900">
                      {currentUser?.company}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Address
                    </h3>
                    <p className="text-lg text-gray-900">
                      {currentUser?.address}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
