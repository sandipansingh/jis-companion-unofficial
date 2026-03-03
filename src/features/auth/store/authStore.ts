import { create } from 'zustand';

import { hasInternetConnection } from '@/src/services/network';
import {
  backgroundSyncUserData,
  checkAuthWithOfflineSupport,
  cleanupUserData,
  syncLoginData,
} from '@/src/services/sync';

import { changePassword as apiChangePassword, getStoredCredentials } from '../api/auth';
import { LoginResponse, UserProfileData } from '../types';

interface AttendancePercentageCache {
  total_class: number;
  attd: number;
  pcent: number;
}

interface AuthState {
  isLoggedIn: boolean;
  studentId: string | null;
  loginData: LoginResponse | null;
  userData: UserProfileData | null;
  authVersion: number;
  isLoggingOut: boolean;
  isOnline: boolean;
  fromCache: boolean;
  isDemoAccount: boolean;
  cachedAttendancePercentage: AttendancePercentageCache | null;
  checkAuthStatus: () => Promise<void>;
  login: (studentId: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string, currentPassword?: string) => Promise<void>;
  syncDataInBackground: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  studentId: null,
  loginData: null,
  userData: null,
  authVersion: 0,
  isLoggingOut: false,
  isOnline: true,
  fromCache: false,
  isDemoAccount: false,
  cachedAttendancePercentage: null,

  checkAuthStatus: async () => {
    if (get().isLoggingOut) {
      return;
    }

    const authVersionAtStart = get().authVersion;

    const clearAuthState = async () => {
      const { studentId } = get();
      if (studentId) {
        try {
          await cleanupUserData(studentId);
        } catch (error) {
          console.error('Error clearing auth state:', error);
        }
      }

      set({
        isLoggedIn: false,
        studentId: null,
        loginData: null,
        userData: null,
        fromCache: false,
        isDemoAccount: false,
      });
    };

    try {
      const authStatus = await checkAuthWithOfflineSupport();

      if (!authStatus.isAuthenticated) {
        await clearAuthState();
        return;
      }

      let cachedAttendancePercentage: AttendancePercentageCache | null = null;
      try {
        const { getAttendancePercentage } = await import('@/src/services/database');
        cachedAttendancePercentage = await getAttendancePercentage(authStatus.studentId!);
      } catch {
        // ignore
      }

      if (get().authVersion !== authVersionAtStart) {
        return;
      }

      set({
        isLoggedIn: true,
        studentId: authStatus.studentId!,
        loginData: authStatus.loginData!,
        userData: authStatus.userData || null,
        isOnline: authStatus.isOnline,
        fromCache: authStatus.fromCache,
        isDemoAccount: authStatus.isDemoAccount || false,
        cachedAttendancePercentage,
      });

      if (authStatus.isOnline && authStatus.fromCache && !authStatus.isDemoAccount) {
        const credentials = await getStoredCredentials();
        if (credentials) {
          setTimeout(() => {
            backgroundSyncUserData(credentials.studentId, credentials.password).then(
              (success) => {
                if (success) {
                  get().checkAuthStatus();
                }
              },
            );
          }, 2000);
        }
      }
    } catch (error: unknown) {
      console.error('Error checking auth status:', error);
      await clearAuthState();
      const message = error instanceof Error ? error.message : '';
      if (message === 'INVALID_CREDENTIALS') {
        throw error;
      }
    }
  },

  login: async (studentId: string, password: string) => {
    const authVersionAtStart = get().authVersion;

    try {
      const credentials = await getStoredCredentials();
      const isDemoLogin = credentials?.isDemoAccount || false;

      const isOnline = await hasInternetConnection();

      if (!isOnline && !isDemoLogin) {
        const result = await syncLoginData(studentId, password);

        if (result.loginData) {
          if (get().authVersion !== authVersionAtStart) {
            return false;
          }

          set({
            isLoggedIn: true,
            studentId,
            loginData: result.loginData,
            userData: result.userData,
            isOnline: false,
            fromCache: true,
            isDemoAccount: false,
          });
          return true;
        } else {
          throw new Error('No cached login data. Please connect to internet.');
        }
      }

      const result = await syncLoginData(studentId, password);

      if (!result.loginData || result.loginData.is_valid !== 1) {
        return false;
      }

      if (get().authVersion !== authVersionAtStart) {
        return false;
      }

      set({
        isLoggedIn: true,
        studentId,
        loginData: result.loginData!,
        userData: result.userData,
        isOnline: true,
        fromCache: result.fromCache,
        isDemoAccount: result.isDemoAccount || false,
      });

      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  },

  logout: async () => {
    const { studentId } = get();
    const nextAuthVersion = get().authVersion + 1;

    set({
      isLoggedIn: false,
      studentId: null,
      loginData: null,
      userData: null,
      authVersion: nextAuthVersion,
      isLoggingOut: true,
      isOnline: true,
      fromCache: false,
      isDemoAccount: false,
    });

    try {
      const [
        { useAttendanceStore },
        { useFeesStore },
        { useVirtualLabsStore },
        { useLibraryStore },
        { useFeedbackStore },
      ] = await Promise.all([
        import('@/src/features/academics/store/attendanceStore'),
        import('@/src/features/fees/store/feesStore'),
        import('@/src/features/virtual-labs/store/virtualLabsStore'),
        import('@/src/features/library/store/libraryStore'),
        import('@/src/features/feedback/store/feedbackStore'),
      ]);

      await Promise.all([
        studentId ? cleanupUserData(studentId) : Promise.resolve(),
        useAttendanceStore.getState().clearAttendanceData(),
        useFeesStore.getState().clearFeeData(),
        useVirtualLabsStore.getState().clearVirtualLabsData(),
        useLibraryStore.getState().clearBooks(),
        useFeedbackStore.getState().clearFeedbackData(),
      ]);
    } catch (error) {
      console.error('Error during logout cleanup:', error);
    } finally {
      set({ isLoggingOut: false });
    }
  },

  changePassword: async (newPassword: string, currentPassword?: string) => {
    try {
      const { studentId } = get();
      if (!studentId) {
        throw new Error('User not logged in');
      }

      let oldPassword = currentPassword;

      if (!oldPassword) {
        const credentials = await getStoredCredentials();
        if (!credentials) {
          throw new Error(
            'Current password not provided and unable to retrieve stored credentials.',
          );
        }
        oldPassword = credentials.password;
      }

      await apiChangePassword(studentId, oldPassword, newPassword);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  syncDataInBackground: async () => {
    const authVersionAtStart = get().authVersion;

    try {
      const { studentId, isOnline } = get();
      if (!studentId || !isOnline) {
        return;
      }

      const credentials = await getStoredCredentials();
      if (!credentials) {
        return;
      }

      const success = await backgroundSyncUserData(
        credentials.studentId,
        credentials.password,
      );

      if (success && get().authVersion === authVersionAtStart) {
        await get().checkAuthStatus();
      }
    } catch (error) {
      console.error('Error in background sync:', error);
    }
  },
}));
