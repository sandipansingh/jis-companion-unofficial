import { hasInternetConnection } from "@/src/services/network";
import {
  backgroundSyncUserData,
  checkAuthWithOfflineSupport,
  cleanupUserData,
  syncLoginData,
} from "@/src/services/sync";
import { create } from "zustand";
import {
  changePassword as apiChangePassword,
  fetchUserProfile,
  getStoredCredentials,
  LoginResponse,
  UserProfileData,
} from "../api/auth";

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
  isOnline: boolean;
  fromCache: boolean;
  isDemoAccount: boolean;
  cachedAttendancePercentage: AttendancePercentageCache | null;
  checkAuthStatus: () => Promise<void>;
  login: (studentId: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
  changePassword: (
    newPassword: string,
    currentPassword?: string
  ) => Promise<void>;
  syncDataInBackground: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  studentId: null,
  loginData: null,
  userData: null,
  isOnline: true,
  fromCache: false,
  isDemoAccount: false,
  cachedAttendancePercentage: null,

  checkAuthStatus: async () => {
    const clearAuthState = async () => {
      const { studentId } = get();
      if (studentId) {
        try {
          await cleanupUserData(studentId);
        } catch (error) {
          console.error("Error clearing auth state:", error);
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
        const { getAttendancePercentage } = await import(
          "@/src/services/database"
        );
        cachedAttendancePercentage = await getAttendancePercentage(
          authStatus.studentId!
        );
      } catch (e) {
        // ignore
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

      if (
        authStatus.isOnline &&
        authStatus.fromCache &&
        !authStatus.isDemoAccount
      ) {
        const credentials = await getStoredCredentials();
        if (credentials) {
          setTimeout(() => {
            backgroundSyncUserData(
              credentials.studentId,
              credentials.password
            ).then((success) => {
              if (success) {
                console.log("Background sync successful, updating state");
                get().checkAuthStatus();
              }
            });
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error("Error checking auth status:", error);
      await clearAuthState();
      if (error.message === "INVALID_CREDENTIALS") {
        throw error;
      }
    }
  },

  login: async (studentId: string, password: string) => {
    try {
      const credentials = await getStoredCredentials();
      const isDemoLogin = credentials?.isDemoAccount || false;

      const isOnline = await hasInternetConnection();

      if (!isOnline && !isDemoLogin) {
        const result = await syncLoginData(studentId, password);

        if (result.loginData) {
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
          throw new Error("No cached login data. Please connect to internet.");
        }
      }

      const result = await syncLoginData(studentId, password);

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
      console.error("Error during login:", error);
      return false;
    }
  },

  loadUserProfile: async () => {
    try {
      const { studentId, loginData } = get();
      if (!studentId || !loginData) {
        throw new Error("User not logged in");
      }

      const isOnline = await hasInternetConnection();

      if (isOnline) {
        const userData = await fetchUserProfile(
          loginData.branch_id.toString(),
          studentId
        );

        const { saveUserData } = await import("@/src/services/database");
        await saveUserData(studentId, userData);

        set({ userData, fromCache: false });
      } else {
        const { getUserData } = await import("@/src/services/database");
        const userData = await getUserData(studentId);

        if (userData) {
          set({ userData, fromCache: true });
        } else {
          throw new Error("No cached user profile available");
        }
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { studentId } = get();
      if (studentId) {
        await cleanupUserData(studentId);

        const { deleteAttendancePercentage } = await import(
          "@/src/services/database"
        );
        await deleteAttendancePercentage(studentId);
      }

      const { useAttendanceStore } = await import(
        "@/src/features/academics/store/attendanceStore"
      );
      useAttendanceStore.getState().clearAttendanceData();

      const { useFeesStore } = await import(
        "@/src/features/fees/store/feesStore"
      );
      useFeesStore.getState().clearFeeData();

      const { useVirtualLabsStore } = await import(
        "@/src/features/virtual-labs/store/virtualLabsStore"
      );
      useVirtualLabsStore.getState().clearVirtualLabsData();

      const { useLibraryStore } = await import(
        "@/src/features/library/store/libraryStore"
      );
      useLibraryStore.getState().clearBooks();

      const { useFeedbackStore } = await import(
        "@/src/features/feedback/store/feedbackStore"
      );
      useFeedbackStore.getState().clearFeedbackData();

      set({
        isLoggedIn: false,
        studentId: null,
        loginData: null,
        userData: null,
        isOnline: true,
        fromCache: false,
        isDemoAccount: false,
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },

  changePassword: async (newPassword: string, currentPassword?: string) => {
    try {
      const { studentId } = get();
      if (!studentId) {
        throw new Error("User not logged in");
      }

      let oldPassword = currentPassword;

      if (!oldPassword) {
        const credentials = await getStoredCredentials();
        if (!credentials) {
          throw new Error(
            "Current password not provided and unable to retrieve stored credentials."
          );
        }
        oldPassword = credentials.password;
      }

      await apiChangePassword(studentId, oldPassword, newPassword);
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  syncDataInBackground: async () => {
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
        credentials.password
      );

      if (success) {
        await get().checkAuthStatus();
      }
    } catch (error) {
      console.error("Error in background sync:", error);
    }
  },
}));
