import {
  AttendanceData,
  DateWiseAttendance,
  fetchAttendancePercentage,
  fetchDateWiseAttendance,
  fetchSubjectWiseAttendance,
  SubjectWiseAttendance,
} from "@/src/features/academics/api/academics";
import {
  login as apiLogin,
  clearUserData as clearSecureStoreData,
  fetchUserProfile,
  getStoredCredentials,
  LoginResponse,
  UserProfileData,
} from "@/src/features/auth/api/auth";
import {
  FeeLedgerEntry,
  fetchStudentFeeLedger,
} from "@/src/features/fees/api/fees";
import {
  fetchLibraryBooks,
  LibraryBook,
  LibraryFilterType,
} from "@/src/features/library/api/library";
import {
  fetchVirtualLabCourses,
  fetchVirtualLabExperiments,
  VirtualLabCourse,
  VirtualLabExperiment,
} from "@/src/features/virtual-labs/api/virtualLabs";
import { getMonthEndDate, getMonthStartDate } from "../utils/dateHelpers";
import {
  deleteAllUserData,
  getAttendanceData,
  getAttendancePercentage,
  getFeeData,
  getLibraryBooks,
  getLoginData,
  getUserData,
  getVirtualLabCourses,
  getVirtualLabExperiments,
  hasLoginData,
  saveAttendanceData,
  saveAttendancePercentage,
  saveFeeData,
  saveLibraryBooks,
  saveLoginData,
  saveUserData,
  saveVirtualLabCourses,
  saveVirtualLabExperiments,
} from "./database";
import { hasInternetConnection } from "./network";

export interface SyncResult {
  success: boolean;
  fromCache: boolean;
  error?: string;
}

export async function syncLoginData(
  studentId: string,
  password: string
): Promise<{
  loginData: LoginResponse | null;
  userData: UserProfileData | null;
  fromCache: boolean;
  isOnline: boolean;
  isDemoAccount?: boolean;
}> {
  const isOnline = await hasInternetConnection();

  let loginData = await getLoginData(studentId);
  let userData = await getUserData(studentId);

  if (isOnline) {
    try {
      console.log("Online mode: Fetching fresh data from API");
      const freshLoginData = await apiLogin({ studentId, password });

      const credentials = await getStoredCredentials();
      const isDemoLogin = credentials?.isDemoAccount || false;

      const freshUserData = await fetchUserProfile(
        freshLoginData.branch_id.toString(),
        freshLoginData.std_id.toString()
      );

      if (!isDemoLogin) {
        await saveLoginData(studentId, freshLoginData);
        if (freshUserData) {
          await saveUserData(studentId, freshUserData);
        }
      }

      return {
        loginData: freshLoginData,
        userData: freshUserData,
        fromCache: false,
        isOnline: true,
        isDemoAccount: isDemoLogin,
      };
    } catch (error) {
      console.error("Error fetching data from API:", error);
      if (loginData || userData) {
        console.log("API failed, using cached data");
        return {
          loginData,
          userData,
          fromCache: true,
          isOnline: true,
          isDemoAccount: false,
        };
      }
      throw error;
    }
  } else {
    console.log("Offline mode: Using cached data");
    if (!loginData) {
      throw new Error("No cached login data available");
    }

    return {
      loginData,
      userData,
      fromCache: true,
      isOnline: false,
      isDemoAccount: false,
    };
  }
}

export async function checkAuthWithOfflineSupport(): Promise<{
  isAuthenticated: boolean;
  studentId?: string;
  loginData?: LoginResponse;
  userData?: UserProfileData;
  isOnline: boolean;
  fromCache: boolean;
  isDemoAccount?: boolean;
}> {
  const isOnline = await hasInternetConnection();

  const localLoginCheck = await hasLoginData();

  if (!localLoginCheck.exists) {
    return {
      isAuthenticated: false,
      isOnline,
      fromCache: false,
      isDemoAccount: false,
    };
  }

  const studentId = localLoginCheck.studentId!;

  if (isOnline) {
    try {
      const credentials = await getStoredCredentials();

      if (!credentials) {
        await deleteAllUserData(studentId);
        return {
          isAuthenticated: false,
          isOnline: true,
          fromCache: false,
          isDemoAccount: false,
        };
      }

      const isDemoLogin = credentials.isDemoAccount || false;

      const loginData = await apiLogin({
        studentId: credentials.studentId,
        password: credentials.password,
      });

      const userData = await fetchUserProfile(
        loginData.branch_id.toString(),
        loginData.std_id.toString()
      );

      if (!isDemoLogin) {
        await saveLoginData(studentId, loginData);
        if (userData) {
          await saveUserData(studentId, userData);
        }
      }

      return {
        isAuthenticated: true,
        studentId,
        loginData,
        userData: userData || undefined,
        isOnline: true,
        fromCache: false,
        isDemoAccount: isDemoLogin,
      };
    } catch (error: any) {
      console.error("API authentication failed:", error);

      if (
        error.message?.includes("Invalid") ||
        error.response?.status === 401
      ) {
        console.log("Invalid credentials, clearing all data");
        await deleteAllUserData(studentId);
        await clearSecureStoreData();
        return {
          isAuthenticated: false,
          isOnline: true,
          fromCache: false,
          isDemoAccount: false,
        };
      }

      const loginData = await getLoginData(studentId);
      const userData = await getUserData(studentId);

      if (loginData) {
        return {
          isAuthenticated: true,
          studentId,
          loginData,
          userData: userData || undefined,
          isOnline: true,
          fromCache: true,
          isDemoAccount: false,
        };
      }

      throw error;
    }
  } else {
    const loginData = await getLoginData(studentId);
    const userData = await getUserData(studentId);

    if (loginData) {
      return {
        isAuthenticated: true,
        studentId,
        loginData,
        userData: userData || undefined,
        isOnline: false,
        fromCache: true,
      };
    }

    return {
      isAuthenticated: false,
      isOnline: false,
      fromCache: false,
    };
  }
}

export async function syncAttendanceData(
  studentId: string,
  collegeId: number,
  branchId: number,
  year: number,
  month: number,
  monthKey: string
): Promise<{
  subjectWiseData: SubjectWiseAttendance[];
  dateWiseData: DateWiseAttendance[];
  fromCache: boolean;
  isOnline: boolean;
}> {
  const isOnline = await hasInternetConnection();

  const cachedData = await getAttendanceData(studentId, monthKey);

  if (isOnline) {
    try {
      console.log(`Online mode: Fetching attendance for ${monthKey}`);

      const fromDate = getMonthStartDate(year, month);
      const toDate = getMonthEndDate(year, month);

      const [subjectWiseData, dateWiseData] = await Promise.all([
        fetchSubjectWiseAttendance(
          studentId,
          collegeId,
          branchId,
          fromDate,
          toDate
        ),

        fetchDateWiseAttendance(
          studentId,
          branchId,
          year.toString(),
          month.toString()
        ),
      ]);

      await saveAttendanceData(
        studentId,
        monthKey,
        subjectWiseData,
        dateWiseData
      );

      return {
        subjectWiseData,
        dateWiseData,
        fromCache: false,
        isOnline: true,
      };
    } catch (error) {
      console.error(`Error fetching attendance for ${monthKey}:`, error);

      if (cachedData) {
        console.log("API failed, using cached attendance data");
        return {
          subjectWiseData: cachedData.subjectWiseData,
          dateWiseData: cachedData.dateWiseData,
          fromCache: true,
          isOnline: true,
        };
      }

      throw error;
    }
  } else {
    console.log(`Offline mode: Using cached attendance for ${monthKey}`);

    if (!cachedData) {
      throw new Error(`No cached attendance data for ${monthKey}`);
    }

    return {
      subjectWiseData: cachedData.subjectWiseData,
      dateWiseData: cachedData.dateWiseData,
      fromCache: true,
      isOnline: false,
    };
  }
}

export async function syncAttendancePercentage(
  studentId: string,
  collegeId: number,
  branchId: number
): Promise<{
  data: AttendanceData;
  isOnline: boolean;
  fromCache: boolean;
}> {
  const isOnline = await hasInternetConnection();

  const cachedData = await getAttendancePercentage(studentId);

  if (isOnline) {
    try {
      console.log("Online mode: Fetching attendance percentage");

      const data = await fetchAttendancePercentage(
        studentId,
        collegeId,
        branchId
      );

      await saveAttendancePercentage(studentId, {
        studentId,
        ...data,
        lastUpdated: new Date().toISOString(),
      });

      return { data, isOnline: true, fromCache: false };
    } catch (error) {
      console.error("Failed to sync attendance percentage:", error);

      if (cachedData) {
        console.log("API failed, using cached attendance percentage data");
        return { data: cachedData, isOnline: false, fromCache: true };
      }

      throw error;
    }
  } else {
    console.log("Offline mode: Using cached attendance percentage");

    if (!cachedData) {
      throw new Error("No cached attendance percentage data available");
    }

    return { data: cachedData, isOnline: false, fromCache: true };
  }
}

export async function syncFeeData(
  studentId: string,
  branchId: number
): Promise<{
  feeData: FeeLedgerEntry[];
  fromCache: boolean;
  isOnline: boolean;
}> {
  const isOnline = await hasInternetConnection();

  const cachedData = await getFeeData(studentId);

  if (isOnline) {
    try {
      console.log("Online mode: Fetching fee data");

      const feeData = await fetchStudentFeeLedger(studentId, branchId);

      await saveFeeData(studentId, feeData);

      return {
        feeData,
        fromCache: false,
        isOnline: true,
      };
    } catch (error) {
      console.error("Error fetching fee data:", error);

      if (cachedData) {
        console.log("API failed, using cached fee data");
        return {
          feeData: cachedData,
          fromCache: true,
          isOnline: true,
        };
      }

      throw error;
    }
  } else {
    console.log("Offline mode: Using cached fee data");

    if (!cachedData) {
      throw new Error("No cached fee data available");
    }

    return {
      feeData: cachedData,
      fromCache: true,
      isOnline: false,
    };
  }
}

export async function backgroundSyncUserData(
  studentId: string,
  password: string
): Promise<boolean> {
  const isOnline = await hasInternetConnection();

  if (!isOnline) {
    console.log("No internet connection, skipping background sync");
    return false;
  }

  try {
    console.log("Background sync: Updating user data");

    const loginData = await apiLogin({ studentId, password });
    const userData = await fetchUserProfile(
      loginData.branch_id.toString(),
      loginData.std_id.toString()
    );

    await saveLoginData(studentId, loginData);
    if (userData) {
      await saveUserData(studentId, userData);
    }

    console.log("Background sync completed successfully");
    return true;
  } catch (error) {
    console.error("Background sync failed:", error);
    return false;
  }
}

export async function cleanupUserData(studentId: string): Promise<void> {
  await deleteAllUserData(studentId);
  await clearSecureStoreData();
  console.log(`Cleanup completed for student: ${studentId}`);
}

export async function syncVirtualLabCourses(): Promise<{
  courses: VirtualLabCourse[];
  fromCache: boolean;
  isOnline: boolean;
}> {
  const isOnline = await hasInternetConnection();

  const cachedCourses = await getVirtualLabCourses();

  if (isOnline) {
    try {
      console.log("Online mode: Fetching virtual lab courses");

      const courses = await fetchVirtualLabCourses();

      await saveVirtualLabCourses(courses);

      return {
        courses,
        fromCache: false,
        isOnline: true,
      };
    } catch (error) {
      console.error("Error fetching virtual lab courses:", error);

      if (cachedCourses) {
        console.log("API failed, using cached virtual lab courses");
        return {
          courses: cachedCourses,
          fromCache: true,
          isOnline: true,
        };
      }

      throw error;
    }
  } else {
    console.log("Offline mode: Using cached virtual lab courses");

    if (!cachedCourses) {
      throw new Error("No cached virtual lab courses available");
    }

    return {
      courses: cachedCourses,
      fromCache: true,
      isOnline: false,
    };
  }
}

export async function syncVirtualLabExperiments(
  course: string,
  stream: string,
  semester: string
): Promise<{
  experiments: VirtualLabExperiment[];
  fromCache: boolean;
  isOnline: boolean;
}> {
  const isOnline = await hasInternetConnection();

  const cachedExperiments = await getVirtualLabExperiments(
    course,
    stream,
    semester
  );

  if (isOnline) {
    try {
      console.log(
        `Online mode: Fetching virtual lab experiments for ${course}/${stream}/${semester}`
      );

      const experiments = await fetchVirtualLabExperiments(
        course,
        stream,
        semester
      );

      await saveVirtualLabExperiments(course, stream, semester, experiments);

      return {
        experiments,
        fromCache: false,
        isOnline: true,
      };
    } catch (error) {
      console.error("Error fetching virtual lab experiments:", error);

      if (cachedExperiments) {
        console.log("API failed, using cached virtual lab experiments");
        return {
          experiments: cachedExperiments,
          fromCache: true,
          isOnline: true,
        };
      }

      throw error;
    }
  } else {
    console.log("Offline mode: Using cached virtual lab experiments");

    if (!cachedExperiments) {
      throw new Error(
        `No cached virtual lab experiments available for ${course}/${stream}/${semester}`
      );
    }

    return {
      experiments: cachedExperiments,
      fromCache: true,
      isOnline: false,
    };
  }
}

export async function syncLibraryBooks(
  studentId: string,
  filterType: LibraryFilterType
): Promise<{
  books: LibraryBook[];
  fromCache: boolean;
  isOnline: boolean;
}> {
  const isOnline = await hasInternetConnection();

  const cachedBooks = await getLibraryBooks(studentId, filterType);

  if (isOnline) {
    try {
      console.log(
        `Online mode: Fetching library books for ${studentId} (filter: ${filterType})`
      );

      const books = await fetchLibraryBooks(studentId, filterType);

      await saveLibraryBooks(studentId, filterType, books);

      return {
        books,
        fromCache: false,
        isOnline: true,
      };
    } catch (error) {
      console.error("Error fetching library books:", error);

      if (cachedBooks) {
        console.log("API failed, using cached library books");
        return {
          books: cachedBooks,
          fromCache: true,
          isOnline: true,
        };
      }

      throw error;
    }
  } else {
    console.log("Offline mode: Using cached library books");

    if (!cachedBooks) {
      throw new Error("No cached library books available");
    }

    return {
      books: cachedBooks,
      fromCache: true,
      isOnline: false,
    };
  }
}
