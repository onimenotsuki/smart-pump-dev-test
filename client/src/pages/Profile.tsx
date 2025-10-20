import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useProfile, useBalance, useUpdateProfile } from '../hooks/useApi';
import { UserUpdateInput } from '../types';
import Logo from '../components/Logo';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: balance, isLoading: balanceLoading } = useBalance();
  const updateProfileMutation = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserUpdateInput>({
    defaultValues: {
      name: profile?.name,
      email: profile?.email,
      phone: profile?.phone,
      address: profile?.address,
      company: profile?.company,
    },
  });

  const onSubmit = async (data: UserUpdateInput) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleCancel = () => {
    reset();
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
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {currentUser?.name.first[0]}{currentUser?.name.last[0]}
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
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                BALANCE: {balanceLoading ? 'Loading...' : balance?.balance}
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      {...register('name.first', { required: 'First name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.name?.first && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.first.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      {...register('name.last', { required: 'Last name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.name?.last && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.last.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      {...register('phone')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      {...register('company')}
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
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
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
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                    <p className="text-lg text-gray-900">
                      {currentUser?.name.first} {currentUser?.name.last}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                    <p className="text-lg text-gray-900">{currentUser?.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                    <p className="text-lg text-gray-900">{currentUser?.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Company</h3>
                    <p className="text-lg text-gray-900">{currentUser?.company}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                    <p className="text-lg text-gray-900">{currentUser?.address}</p>
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
