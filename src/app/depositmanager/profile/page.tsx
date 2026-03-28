'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DepositNavigation from '@/components/deposits/DepositNavigation';
import LoadingSpinner, { PageLoader } from '@/components/deposits/LoadingSpinner';
import { authService } from '@/lib/deposits/auth';
import { depositApi } from '@/lib/deposits';
import { User, UserProfile } from '@/lib/deposits/types';

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/depositmanager/login');
      return;
    }

    setUser(currentUser);
    loadProfile(currentUser);
  }, [router]);

  const resolveBankName = async (bankId?: string) => {
    if (!bankId) {
      return undefined;
    }

    try {
      const banks = await depositApi.getBanks();
      const match = banks.find((bank) => String(bank.id || '').toUpperCase() === String(bankId).toUpperCase());
      return match?.name;
    } catch {
      return undefined;
    }
  };

  const loadProfile = async (currentUser: User) => {
    setLoading(true);
    setError('');

    try {
      const userId = currentUser.userId || currentUser.id;
      const fetchedProfile = await depositApi.getUserProfile(userId);
      setProfile(fetchedProfile);

      const updatedUser: User = {
        ...currentUser,
        userId: fetchedProfile.userId,
        id: fetchedProfile.userId,
        role: (fetchedProfile.role === 'bank' || fetchedProfile.role === 'account' || fetchedProfile.role === 'commissioner')
          ? fetchedProfile.role
          : currentUser.role,
        roleId: fetchedProfile.roleId,
        name: fetchedProfile.name || currentUser.name,
        status: fetchedProfile.status,
        bankId: fetchedProfile.bankId || currentUser.bankId,
        bankName: fetchedProfile.bankName || currentUser.bankName,
      };

      if (!updatedUser.bankName && updatedUser.bankId) {
        const resolvedName = await resolveBankName(updatedUser.bankId);
        if (resolvedName) {
          updatedUser.bankName = resolvedName;
        }
      }

      localStorage.setItem('smkc_deposit_auth', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (e: any) {
      const fallbackUser: User = { ...currentUser };
      if (!fallbackUser.bankName && fallbackUser.bankId) {
        const resolvedName = await resolveBankName(fallbackUser.bankId);
        if (resolvedName) {
          fallbackUser.bankName = resolvedName;
        }
      }

      localStorage.setItem('smkc_deposit_auth', JSON.stringify(fallbackUser));
      setUser(fallbackUser);

      const hasFallbackProfile = Boolean(fallbackUser.userId || fallbackUser.id);
      setError(hasFallbackProfile ? '' : (e?.message || 'Failed to load profile details'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!user) {
      setError('User session not found. Please login again.');
      return;
    }

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('All password fields are required.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const userId = user.userId || user.id;
      const response = await depositApi.changePassword({
        userId,
        oldPassword,
        newPassword,
      });

      setMessage(response.message || 'Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setError(e?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DepositNavigation user={user} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-600 mt-2">View user details and update your password</p>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Profile Details</h2>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500">User ID</p>
                  <p className="text-gray-900 font-semibold">{profile?.userId || user.userId || user.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="text-gray-900 font-semibold">{profile?.name || user.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="text-gray-900 font-semibold">{profile?.status || user.status || 'N/A'}</p>
                </div>

                {(profile?.roleId === 3 || profile?.role === 'bank' || user.role === 'bank') && (
                  <>
                    <div>
                      <p className="text-gray-500">Bank ID</p>
                      <p className="text-gray-900 font-semibold">{profile?.bankId || user.bankId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Bank Name</p>
                      <p className="text-gray-900 font-semibold">{profile?.bankName || user.bankName || 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </section>

            <section id="change-password" className="bg-white rounded-xl shadow-md p-6 scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Change Password</h2>

              {message && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                  {message}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Old Password
                  </label>
                  <input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={isChangingPassword}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isChangingPassword}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                    minLength={8}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
