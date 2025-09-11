import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    bio: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authService.getProfile();
        const profile = res.data?.user || authUser || null;
        setUser(profile);
        setForm({
          firstName: profile?.firstName || '',
          lastName: profile?.lastName || '',
          phone: profile?.phone || '',
          location: profile?.location || '',
          bio: profile?.bio || '',
        });
      } catch (e) {
        setError('Failed to load profile.');
      }
    };
    loadProfile();
  }, [authUser]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is a data URL; store to user and will submit via update
      setUser((prev) => ({ ...(prev || {}), avatar: reader.result }));
      setMessage(null);
    };
    reader.onerror = () => setError('Failed to read image file.');
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const payload = { ...form };
      if (user?.avatar) payload.avatar = user.avatar;
      const res = await authService.updateProfile(payload);
      setUser(res.data?.user || user);
      setMessage('Profile updated successfully.');
    } catch (e) {
      setError(e.userMessage || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwdSaving(true);
    setMessage(null);
    setError(null);
    try {
      await authService.changePassword(passwordForm);
      setMessage('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setError(e.userMessage || 'Failed to change password.');
    } finally {
      setPwdSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">View and update your personal information</p>
      </div>

      {(message || error) && (
        <div className={`rounded-md p-3 text-sm ${message ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message || error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl text-gray-500 dark:text-gray-300">
                  {user.firstName?.[0] || '?'}
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Photo</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="block w-full text-sm text-gray-700 dark:text-gray-300" />
          </div>
        </div>

        {/* Edit profile form */}
        <form onSubmit={saveProfile} className="card lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input className="input-field" name="firstName" value={form.firstName} onChange={handleInput} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input className="input-field" name="lastName" value={form.lastName} onChange={handleInput} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input className="input-field" name="phone" value={form.phone} onChange={handleInput} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input className="input-field" name="location" value={form.location} onChange={handleInput} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea className="input-field" name="bio" rows="4" value={form.bio} onChange={handleInput} />
            </div>
          </div>

          <div className="mt-4">
            <button disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <form onSubmit={changePassword} className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
            <input type="password" className="input-field" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <input type="password" className="input-field" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input type="password" className="input-field" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
          </div>
        </div>
        <div className="mt-4">
          <button disabled={pwdSaving} className="btn-primary">
            {pwdSaving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
