import {
  AttendanceData,
  DateWiseAttendance,
  SubjectWiseAttendance,
} from "@/src/features/academics/api/academics";
import { LoginResponse, UserProfileData } from "@/src/features/auth/api/auth";
import { FeeLedgerEntry } from "@/src/features/fees/api/fees";
import { LibraryBook } from "@/src/features/library/api/library";
import {
  VirtualLabCourse,
  VirtualLabExperiment,
} from "@/src/features/virtual-labs/api/virtualLabs";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

export interface AttendancePercentageData extends AttendanceData {
  studentId: string;
  lastUpdated: string;
}

const GLOBAL_DATA_KEY = "__global__";

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  const setupDatabase = async (database: SQLite.SQLiteDatabase) => {
    await database.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS login_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT UNIQUE NOT NULL,
        login_response TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT UNIQUE NOT NULL,
        profile_data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS attendance_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        month_key TEXT NOT NULL,
        subject_wise_data TEXT NOT NULL,
        date_wise_data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        UNIQUE(student_id, month_key)
      );

      CREATE TABLE IF NOT EXISTS fees_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT UNIQUE NOT NULL,
        fee_ledger TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS attendance_percentage (
        student_id TEXT PRIMARY KEY NOT NULL,
        total_class INTEGER NOT NULL,
        attd INTEGER NOT NULL,
        pcent REAL NOT NULL,
        last_updated TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS virtual_labs_courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        courses_data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS virtual_labs_experiments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        course TEXT NOT NULL,
        stream TEXT NOT NULL,
        semester TEXT NOT NULL,
        experiments_data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        UNIQUE(student_id, course, stream, semester)
      );

      CREATE TABLE IF NOT EXISTS library_books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        filter_type TEXT NOT NULL,
        books_data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        UNIQUE(student_id, filter_type)
      );

      CREATE INDEX IF NOT EXISTS idx_login_student_id ON login_data(student_id);
      CREATE INDEX IF NOT EXISTS idx_user_student_id ON user_data(student_id);
      CREATE INDEX IF NOT EXISTS idx_attendance_student_month ON attendance_data(student_id, month_key);
      CREATE INDEX IF NOT EXISTS idx_fees_student_id ON fees_data(student_id);
      CREATE INDEX IF NOT EXISTS idx_attendance_percentage_student_id ON attendance_percentage(student_id);
      CREATE INDEX IF NOT EXISTS idx_virtual_labs_courses_student_id ON virtual_labs_courses(student_id);
      CREATE INDEX IF NOT EXISTS idx_virtual_labs_experiments_student_course ON virtual_labs_experiments(student_id, course, stream, semester);
      CREATE INDEX IF NOT EXISTS idx_library_books_student_filter ON library_books(student_id, filter_type);
    `);
  };

  try {
    db = await SQLite.openDatabaseAsync("jiscompanion.db");
    await setupDatabase(db);
  } catch (error: any) {
    if (Platform.OS === "web" && error?.message?.includes("Invalid VFS state")) {
      console.warn("Database initialization failed with Invalid VFS state. Attempting to reset database...", error);
      try {
        await SQLite.deleteDatabaseAsync("jiscompanion.db");
        db = await SQLite.openDatabaseAsync("jiscompanion.db");
        await setupDatabase(db);
      } catch (retryError) {
        console.error("Failed to recover database:", retryError);
        throw retryError;
      }
    } else {
      throw error;
    }
  }

  console.log("Database initialized successfully");
  return db;
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    return initDatabase();
  }
  return db;
}

interface SaveDataParams {
  table: string;
  studentId: string;
  columns: string[];
  values: any[];
  logMessage?: string;
  additionalKeys?: { [key: string]: any };
  includeTimestamps?: boolean;
}

interface GetDataParams {
  table: string;
  studentId: string;
  columns: string[];
  additionalKeys?: { [key: string]: any };
}

interface DeleteDataParams {
  table: string;
  studentId: string;
  additionalKeys?: { [key: string]: any };
  logMessage?: string;
}

async function saveData({
  table,
  studentId,
  columns,
  values,
  logMessage,
  additionalKeys = {},
  includeTimestamps = true,
}: SaveDataParams): Promise<void> {
  const database = await getDatabase();
  const now = Date.now();

  const additionalKeyColumns = Object.keys(additionalKeys);
  const additionalKeyValues = Object.values(additionalKeys);

  const allColumns = [
    "student_id",
    ...additionalKeyColumns,
    ...columns,
    ...(includeTimestamps ? ["created_at", "updated_at"] : []),
  ];
  const placeholders = allColumns.map(() => "?").join(", ");
  const allValues = [
    studentId,
    ...additionalKeyValues,
    ...values,
    ...(includeTimestamps ? [now, now] : []),
  ];

  await database.runAsync(
    `INSERT OR REPLACE INTO ${table} (${allColumns.join(", ")})
     VALUES (${placeholders})`,
    ...allValues
  );

  if (logMessage) {
    console.log(logMessage);
  }
}

async function getData<T>({
  table,
  studentId,
  columns,
  additionalKeys = {},
}: GetDataParams): Promise<T | null> {
  const database = await getDatabase();

  const additionalKeyColumns = Object.keys(additionalKeys);
  const additionalKeyValues = Object.values(additionalKeys);

  const whereConditions = [
    "student_id = ?",
    ...additionalKeyColumns.map((key) => `${key} = ?`),
  ];
  const whereValues = [studentId, ...additionalKeyValues];

  const result = await database.getFirstAsync<any>(
    `SELECT ${columns.join(", ")} FROM ${table} WHERE ${whereConditions.join(
      " AND "
    )}`,
    ...whereValues
  );

  return result || null;
}

async function deleteData({
  table,
  studentId,
  additionalKeys = {},
  logMessage,
}: DeleteDataParams): Promise<void> {
  const database = await getDatabase();

  const additionalKeyColumns = Object.keys(additionalKeys);
  const additionalKeyValues = Object.values(additionalKeys);

  const whereConditions = [
    "student_id = ?",
    ...additionalKeyColumns.map((key) => `${key} = ?`),
  ];
  const whereValues = [studentId, ...additionalKeyValues];

  await database.runAsync(
    `DELETE FROM ${table} WHERE ${whereConditions.join(" AND ")}`,
    ...whereValues
  );

  if (logMessage) {
    console.log(logMessage);
  }
}

export async function saveLoginData(
  studentId: string,
  loginResponse: LoginResponse
): Promise<void> {
  await saveData({
    table: "login_data",
    studentId,
    columns: ["login_response"],
    values: [JSON.stringify(loginResponse)],
    logMessage: `Login data saved for student: ${studentId}`,
  });
}

export async function getLoginData(
  studentId: string
): Promise<LoginResponse | null> {
  const result = await getData<{ login_response: string }>({
    table: "login_data",
    studentId,
    columns: ["login_response"],
  });

  if (result) {
    return JSON.parse(result.login_response) as LoginResponse;
  }

  return null;
}

export async function hasLoginData(): Promise<{
  exists: boolean;
  studentId?: string;
}> {
  const database = await getDatabase();

  const result = await database.getFirstAsync<{
    student_id: string;
  }>("SELECT student_id FROM login_data LIMIT 1");

  if (result) {
    return { exists: true, studentId: result.student_id };
  }

  return { exists: false };
}

export async function deleteLoginData(studentId: string): Promise<void> {
  await deleteData({
    table: "login_data",
    studentId,
    logMessage: `Login data deleted for student: ${studentId}`,
  });
}

export async function saveUserData(
  studentId: string,
  profileData: UserProfileData
): Promise<void> {
  await saveData({
    table: "user_data",
    studentId,
    columns: ["profile_data"],
    values: [JSON.stringify(profileData)],
    logMessage: `User data saved for student: ${studentId}`,
  });
}

export async function getUserData(
  studentId: string
): Promise<UserProfileData | null> {
  const result = await getData<{ profile_data: string }>({
    table: "user_data",
    studentId,
    columns: ["profile_data"],
  });

  if (result) {
    return JSON.parse(result.profile_data) as UserProfileData;
  }

  return null;
}

export async function deleteUserData(studentId: string): Promise<void> {
  await deleteData({
    table: "user_data",
    studentId,
    logMessage: `User data deleted for student: ${studentId}`,
  });
}

export async function saveAttendanceData(
  studentId: string,
  monthKey: string,
  subjectWiseData: SubjectWiseAttendance[],
  dateWiseData: DateWiseAttendance[]
): Promise<void> {
  await saveData({
    table: "attendance_data",
    studentId,
    additionalKeys: { month_key: monthKey },
    columns: ["subject_wise_data", "date_wise_data"],
    values: [JSON.stringify(subjectWiseData), JSON.stringify(dateWiseData)],
    logMessage: `Attendance data saved for ${studentId} - ${monthKey}`,
  });
}

export async function getAttendanceData(
  studentId: string,
  monthKey: string
): Promise<{
  subjectWiseData: SubjectWiseAttendance[];
  dateWiseData: DateWiseAttendance[];
} | null> {
  const result = await getData<{
    subject_wise_data: string;
    date_wise_data: string;
  }>({
    table: "attendance_data",
    studentId,
    additionalKeys: { month_key: monthKey },
    columns: ["subject_wise_data", "date_wise_data"],
  });

  if (result) {
    return {
      subjectWiseData: JSON.parse(
        result.subject_wise_data
      ) as SubjectWiseAttendance[],
      dateWiseData: JSON.parse(result.date_wise_data) as DateWiseAttendance[],
    };
  }

  return null;
}

export async function getAllAttendanceData(studentId: string): Promise<
  Array<{
    monthKey: string;
    subjectWiseData: SubjectWiseAttendance[];
    dateWiseData: DateWiseAttendance[];
  }>
> {
  const database = await getDatabase();

  const results = await database.getAllAsync<{
    month_key: string;
    subject_wise_data: string;
    date_wise_data: string;
  }>(
    "SELECT month_key, subject_wise_data, date_wise_data FROM attendance_data WHERE student_id = ? ORDER BY month_key DESC",
    studentId
  );

  return results.map((row) => ({
    monthKey: row.month_key,
    subjectWiseData: JSON.parse(
      row.subject_wise_data
    ) as SubjectWiseAttendance[],
    dateWiseData: JSON.parse(row.date_wise_data) as DateWiseAttendance[],
  }));
}

export async function deleteAttendanceData(studentId: string): Promise<void> {
  await deleteData({
    table: "attendance_data",
    studentId,
    logMessage: `Attendance data deleted for student: ${studentId}`,
  });
}

export async function saveFeeData(
  studentId: string,
  feeLedger: FeeLedgerEntry[]
): Promise<void> {
  await saveData({
    table: "fees_data",
    studentId,
    columns: ["fee_ledger"],
    values: [JSON.stringify(feeLedger)],
    logMessage: `Fee data saved for student: ${studentId}`,
  });
}

export async function getFeeData(
  studentId: string
): Promise<FeeLedgerEntry[] | null> {
  const result = await getData<{ fee_ledger: string }>({
    table: "fees_data",
    studentId,
    columns: ["fee_ledger"],
  });

  if (result) {
    return JSON.parse(result.fee_ledger) as FeeLedgerEntry[];
  }

  return null;
}

export async function deleteFeeData(studentId: string): Promise<void> {
  await deleteData({
    table: "fees_data",
    studentId,
    logMessage: `Fee data deleted for student: ${studentId}`,
  });
}

export async function saveAttendancePercentage(
  studentId: string,
  data: AttendancePercentageData
): Promise<void> {
  await saveData({
    table: "attendance_percentage",
    studentId,
    columns: ["total_class", "attd", "pcent", "last_updated"],
    values: [data.total_class, data.attd, data.pcent, data.lastUpdated],
    includeTimestamps: false,
    logMessage: `Attendance percentage saved for student: ${studentId}`,
  });
}

export async function getAttendancePercentage(
  studentId: string
): Promise<AttendancePercentageData | null> {
  const result = await getData<{
    student_id: string;
    total_class: number;
    attd: number;
    pcent: number;
    last_updated: string;
  }>({
    table: "attendance_percentage",
    studentId,
    columns: ["student_id", "total_class", "attd", "pcent", "last_updated"],
  });

  if (!result) return null;

  return {
    studentId: result.student_id,
    total_class: result.total_class,
    attd: result.attd,
    pcent: result.pcent,
    lastUpdated: result.last_updated,
  };
}

export async function deleteAttendancePercentage(
  studentId: string
): Promise<void> {
  await deleteData({
    table: "attendance_percentage",
    studentId,
    logMessage: `Attendance percentage deleted for student: ${studentId}`,
  });
}

export async function saveVirtualLabCourses(
  courses: VirtualLabCourse[]
): Promise<void> {
  await saveData({
    table: "virtual_labs_courses",
    studentId: GLOBAL_DATA_KEY,
    columns: ["courses_data"],
    values: [JSON.stringify(courses)],
    logMessage: `Virtual lab courses saved (${courses.length} courses)`,
  });
}

export async function getVirtualLabCourses(): Promise<
  VirtualLabCourse[] | null
> {
  const result = await getData<{ courses_data: string }>({
    table: "virtual_labs_courses",
    studentId: GLOBAL_DATA_KEY,
    columns: ["courses_data"],
  });

  if (result) {
    return JSON.parse(result.courses_data) as VirtualLabCourse[];
  }

  return null;
}

export async function deleteVirtualLabCourses(): Promise<void> {
  await deleteData({
    table: "virtual_labs_courses",
    studentId: GLOBAL_DATA_KEY,
    logMessage: "Virtual lab courses deleted",
  });
}

export async function saveVirtualLabExperiments(
  course: string,
  stream: string,
  semester: string,
  experiments: VirtualLabExperiment[]
): Promise<void> {
  await saveData({
    table: "virtual_labs_experiments",
    studentId: GLOBAL_DATA_KEY,
    additionalKeys: { course, stream, semester },
    columns: ["experiments_data"],
    values: [JSON.stringify(experiments)],
    logMessage: `Virtual lab experiments saved for ${course}/${stream}/${semester} (${experiments.length} experiments)`,
  });
}

export async function getVirtualLabExperiments(
  course: string,
  stream: string,
  semester: string
): Promise<VirtualLabExperiment[] | null> {
  const result = await getData<{ experiments_data: string }>({
    table: "virtual_labs_experiments",
    studentId: GLOBAL_DATA_KEY,
    additionalKeys: { course, stream, semester },
    columns: ["experiments_data"],
  });

  if (result) {
    return JSON.parse(result.experiments_data) as VirtualLabExperiment[];
  }

  return null;
}

export async function deleteVirtualLabExperiments(): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    "DELETE FROM virtual_labs_experiments WHERE student_id = ?",
    GLOBAL_DATA_KEY
  );
  console.log("Virtual lab experiments deleted");
}

export async function saveLibraryBooks(
  studentId: string,
  filterType: string,
  books: LibraryBook[]
): Promise<void> {
  await saveData({
    table: "library_books",
    studentId,
    additionalKeys: { filter_type: filterType },
    columns: ["books_data"],
    values: [JSON.stringify(books)],
    logMessage: `Library books saved for student: ${studentId}, filter: ${filterType} (${books.length} books)`,
  });
}

export async function getLibraryBooks(
  studentId: string,
  filterType: string
): Promise<LibraryBook[] | null> {
  const result = await getData<{ books_data: string }>({
    table: "library_books",
    studentId,
    additionalKeys: { filter_type: filterType },
    columns: ["books_data"],
  });

  if (result) {
    return JSON.parse(result.books_data) as LibraryBook[];
  }

  return null;
}

export async function deleteLibraryBooks(studentId: string): Promise<void> {
  await deleteData({
    table: "library_books",
    studentId,
    logMessage: `Library books deleted for student: ${studentId}`,
  });
}

export async function deleteAllUserData(studentId: string): Promise<void> {
  const database = await getDatabase();

  await database.withTransactionAsync(async () => {
    await database.runAsync(
      "DELETE FROM login_data WHERE student_id = ?",
      studentId
    );
    await database.runAsync(
      "DELETE FROM user_data WHERE student_id = ?",
      studentId
    );
    await database.runAsync(
      "DELETE FROM attendance_data WHERE student_id = ?",
      studentId
    );
    await database.runAsync(
      "DELETE FROM fees_data WHERE student_id = ?",
      studentId
    );
    await database.runAsync(
      "DELETE FROM attendance_percentage WHERE student_id = ?",
      studentId
    );
    await database.runAsync(
      "DELETE FROM library_books WHERE student_id = ?",
      studentId
    );
  });

  console.log(`All data deleted for student: ${studentId}`);
}

export async function clearDatabase(): Promise<void> {
  const database = await getDatabase();

  await database.execAsync(`
    DELETE FROM login_data;
    DELETE FROM user_data;
    DELETE FROM attendance_data;
    DELETE FROM fees_data;
    DELETE FROM attendance_percentage;
    DELETE FROM virtual_labs_courses;
    DELETE FROM virtual_labs_experiments;
    DELETE FROM library_books;
  `);

  console.log("Database cleared");
}
