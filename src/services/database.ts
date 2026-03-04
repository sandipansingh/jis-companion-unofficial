import * as SQLite from 'expo-sqlite';

import {
  AttendanceData,
  DateWiseAttendance,
  SubjectWiseAttendance,
} from '@/src/features/academics/types';
import { LoginResponse, UserProfileData } from '@/src/features/auth/types';
import { QRPayload, ScannedContact, SocialProfile } from '@/src/features/connect/types';
import { FeeLedgerEntry } from '@/src/features/fees/types';
import { LibraryBook } from '@/src/features/library/types';
import {
  VirtualLabCourse,
  VirtualLabExperiment,
} from '@/src/features/virtual-labs/types';
import { device } from '@/src/hooks/useDevice';

export interface AttendancePercentageData extends AttendanceData {
  studentId: string;
  lastUpdated: string;
}

const GLOBAL_DATA_KEY = '__global__';

let db: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  if (initPromise) {
    return initPromise;
  }

  const CURRENT_DB_VERSION = 1;

  const createTablesV1 = async (database: SQLite.SQLiteDatabase) => {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS login_data (
        student_id TEXT PRIMARY KEY NOT NULL,
        login_response TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_data (
        student_id TEXT PRIMARY KEY NOT NULL,
        profile_data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS attendance_data (
        student_id TEXT NOT NULL,
        month_key TEXT NOT NULL,
        subject_wise_data TEXT NOT NULL,
        date_wise_data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (student_id, month_key)
      );

      CREATE TABLE IF NOT EXISTS fees_data (
        student_id TEXT PRIMARY KEY NOT NULL,
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
        student_id TEXT PRIMARY KEY NOT NULL,
        courses_data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS virtual_labs_experiments (
        student_id TEXT NOT NULL,
        course TEXT NOT NULL,
        stream TEXT NOT NULL,
        semester TEXT NOT NULL,
        experiments_data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (student_id, course, stream, semester)
      );

      CREATE TABLE IF NOT EXISTS library_books (
        student_id TEXT NOT NULL,
        filter_type TEXT NOT NULL,
        books_data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (student_id, filter_type)
      );

      CREATE TABLE IF NOT EXISTS social_profiles (
        student_id TEXT PRIMARY KEY NOT NULL,
        social_data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS scanned_contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scanned_by TEXT NOT NULL,
        student_id TEXT,
        payload TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        UNIQUE(scanned_by, student_id)
      );
    `);
  };

  const setupDatabase = async (database: SQLite.SQLiteDatabase) => {
    if (!device.isWeb) {
      await database.execAsync(`PRAGMA journal_mode = WAL;`);
    }

    // Read current schema version
    const versionRow = await database.getFirstAsync<{ user_version: number }>(
      `PRAGMA user_version`,
    );
    const currentVersion = versionRow?.user_version ?? 0;

    if (currentVersion < 1) {
      await database.execAsync(`
        DROP TABLE IF EXISTS login_data;
        DROP TABLE IF EXISTS user_data;
        DROP TABLE IF EXISTS attendance_data;
        DROP TABLE IF EXISTS fees_data;
        DROP TABLE IF EXISTS attendance_percentage;
        DROP TABLE IF EXISTS virtual_labs_courses;
        DROP TABLE IF EXISTS virtual_labs_experiments;
        DROP TABLE IF EXISTS library_books;
        DROP TABLE IF EXISTS social_profiles;
        DROP TABLE IF EXISTS scanned_contacts;
      `);
      await createTablesV1(database);
      await database.execAsync(`PRAGMA user_version = ${CURRENT_DB_VERSION};`);
    } else {
      // Schema is up-to-date; just ensure tables exist (idempotent)
      await createTablesV1(database);
    }
  };

  initPromise = (async () => {
    try {
      const database = await SQLite.openDatabaseAsync('jiscompanion.db');
      await setupDatabase(database);
      db = database;
      return db;
    } catch (error: any) {
      if (
        device.isWeb &&
        (error?.message?.includes('Invalid VFS state') ||
          error?.message?.includes('Access Handles cannot be created') ||
          error?.message?.includes('NoModificationAllowedError'))
      ) {
        console.warn('Database lock/VFS error detected. Deleting and retrying...', error);
        try {
          if (db) {
            await db.closeAsync();
          }
          await SQLite.deleteDatabaseAsync('jiscompanion.db');
          const database = await SQLite.openDatabaseAsync('jiscompanion.db');
          await setupDatabase(database);
          db = database;
          return db;
        } catch (retryError) {
          console.error('Failed to recover database:', retryError);
          initPromise = null;
          throw retryError;
        }
      } else {
        initPromise = null;
        throw error;
      }
    }
  })();

  return initPromise;
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
  additionalKeys?: { [key: string]: any };
  includeTimestamps?: boolean;
}

interface GetDataParams {
  table: string;
  studentId?: string;
  columns: string[];
  additionalKeys?: { [key: string]: any };
  orderBy?: string;
  limit?: number;
  updatedSince?: number;
}

interface DeleteDataParams {
  table: string;
  studentId?: string;
  additionalKeys?: { [key: string]: any };
  idColumn?: string;
  idValue?: any;
}

interface GetAllDataParams {
  table: string;
  studentId?: string;
  columns: string[];
  additionalKeys?: { [key: string]: any };
  whereColumn?: string;
  whereValue?: any;
  orderBy?: string;
  limit?: number;
}

async function saveData({
  table,
  studentId,
  columns,
  values,
  additionalKeys = {},
  includeTimestamps = true,
}: SaveDataParams): Promise<void> {
  const database = await getDatabase();
  const now = Date.now();

  const additionalKeyColumns = Object.keys(additionalKeys);
  const additionalKeyValues = Object.values(additionalKeys);

  // Primary-key columns (conflict target)
  const pkColumns = ['student_id', ...additionalKeyColumns];

  // All columns to insert (pk + data + timestamps)
  const allInsertColumns = [
    ...pkColumns,
    ...columns,
    ...(includeTimestamps ? ['created_at', 'updated_at'] : []),
  ];
  const placeholders = allInsertColumns.map(() => '?').join(', ');
  const allValues = [
    studentId,
    ...additionalKeyValues,
    ...values,
    ...(includeTimestamps ? [now, now] : []),
  ];

  // On conflict update data columns + updated_at but preserve created_at
  const updateColumns = [...columns, ...(includeTimestamps ? ['updated_at'] : [])];
  const updateSet = updateColumns.map((col) => `${col} = excluded.${col}`).join(', ');
  const conflictTarget = pkColumns.join(', ');

  await database.runAsync(
    `INSERT INTO ${table} (${allInsertColumns.join(', ')})
     VALUES (${placeholders})
     ON CONFLICT(${conflictTarget}) DO UPDATE SET ${updateSet}`,
    ...allValues,
  );
}

async function getData<T>({
  table,
  studentId,
  columns,
  additionalKeys = {},
  orderBy,
  limit,
  updatedSince,
}: GetDataParams): Promise<T | null> {
  const database = await getDatabase();

  const additionalKeyColumns = Object.keys(additionalKeys);
  const additionalKeyValues = Object.values(additionalKeys);

  const whereConditions: string[] = [];
  const whereValues: any[] = [];

  if (studentId) {
    whereConditions.push('student_id = ?');
    whereValues.push(studentId);
  }

  additionalKeyColumns.forEach((key) => {
    whereConditions.push(`${key} = ?`);
  });
  whereValues.push(...additionalKeyValues);

  if (updatedSince !== undefined) {
    whereConditions.push('updated_at > ?');
    whereValues.push(updatedSince);
  }

  let query = `SELECT ${columns.join(', ')} FROM ${table}`;

  if (whereConditions.length > 0) {
    query += ` WHERE ${whereConditions.join(' AND ')}`;
  }

  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }

  if (limit) {
    query += ` LIMIT ${limit}`;
  }

  const result = await database.getFirstAsync<any>(query, ...whereValues);

  return result || null;
}

async function deleteData({
  table,
  studentId,
  additionalKeys = {},
  idColumn,
  idValue,
}: DeleteDataParams): Promise<void> {
  const database = await getDatabase();

  // ID-based deletion (e.g. scanned_contacts by row id)
  if (idColumn !== undefined && idValue !== undefined) {
    await database.runAsync(`DELETE FROM ${table} WHERE ${idColumn} = ?`, idValue);
    return;
  }

  // Standard student-scoped deletion
  const additionalKeyColumns = Object.keys(additionalKeys);
  const additionalKeyValues = Object.values(additionalKeys);

  const whereConditions = [
    'student_id = ?',
    ...additionalKeyColumns.map((key) => `${key} = ?`),
  ];
  const whereValues = [studentId, ...additionalKeyValues];

  await database.runAsync(
    `DELETE FROM ${table} WHERE ${whereConditions.join(' AND ')}`,
    ...whereValues,
  );
}

async function getAllData<T>({
  table,
  studentId,
  columns,
  additionalKeys = {},
  whereColumn,
  whereValue,
  orderBy,
  limit,
}: GetAllDataParams): Promise<T[]> {
  const database = await getDatabase();

  const additionalKeyColumns = Object.keys(additionalKeys);
  const additionalKeyValues = Object.values(additionalKeys);

  const whereConditions: string[] = [];
  const whereValues: any[] = [];

  if (studentId !== undefined) {
    whereConditions.push('student_id = ?');
    whereValues.push(studentId);
  }

  if (whereColumn !== undefined && whereValue !== undefined) {
    whereConditions.push(`${whereColumn} = ?`);
    whereValues.push(whereValue);
  }

  additionalKeyColumns.forEach((key) => {
    whereConditions.push(`${key} = ?`);
  });
  whereValues.push(...additionalKeyValues);

  let query = `SELECT ${columns.join(', ')} FROM ${table}`;

  if (whereConditions.length > 0) {
    query += ` WHERE ${whereConditions.join(' AND ')}`;
  }

  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }

  if (limit) {
    query += ` LIMIT ${limit}`;
  }

  return database.getAllAsync<T>(query, ...whereValues);
}

export async function saveLoginData(
  studentId: string,
  loginResponse: LoginResponse,
): Promise<void> {
  await saveData({
    table: 'login_data',
    studentId,
    columns: ['login_response'],
    values: [JSON.stringify(loginResponse)],
  });
}

export async function getLoginData(studentId: string): Promise<LoginResponse | null> {
  const result = await getData<{ login_response: string }>({
    table: 'login_data',
    studentId,
    columns: ['login_response'],
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
  }>('SELECT student_id FROM login_data LIMIT 1');

  if (result) {
    return { exists: true, studentId: result.student_id };
  }

  return { exists: false };
}

export async function getLatestLoginDataForStudent(studentId: string): Promise<{
  studentId: string;
  loginData: LoginResponse;
} | null> {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  const result = await getData<{
    student_id: string;
    login_response: string;
  }>({
    table: 'login_data',
    studentId,
    columns: ['student_id', 'login_response'],
    orderBy: 'updated_at DESC',
    limit: 1,
    updatedSince: thirtyDaysAgo,
  });

  if (result) {
    return {
      studentId: result.student_id,
      loginData: JSON.parse(result.login_response) as LoginResponse,
    };
  }

  return null;
}

export async function deleteLoginData(studentId: string): Promise<void> {
  await deleteData({
    table: 'login_data',
    studentId,
  });
}

export async function saveUserData(
  studentId: string,
  profileData: UserProfileData,
): Promise<void> {
  await saveData({
    table: 'user_data',
    studentId,
    columns: ['profile_data'],
    values: [JSON.stringify(profileData)],
  });
}

export async function getUserData(studentId: string): Promise<UserProfileData | null> {
  const result = await getData<{ profile_data: string }>({
    table: 'user_data',
    studentId,
    columns: ['profile_data'],
  });

  if (result) {
    return JSON.parse(result.profile_data) as UserProfileData;
  }

  return null;
}

export async function deleteUserData(studentId: string): Promise<void> {
  await deleteData({
    table: 'user_data',
    studentId,
  });
}

export async function saveAttendanceData(
  studentId: string,
  monthKey: string,
  subjectWiseData: SubjectWiseAttendance[],
  dateWiseData: DateWiseAttendance[],
): Promise<void> {
  await saveData({
    table: 'attendance_data',
    studentId,
    additionalKeys: { month_key: monthKey },
    columns: ['subject_wise_data', 'date_wise_data'],
    values: [JSON.stringify(subjectWiseData), JSON.stringify(dateWiseData)],
  });
}

export async function getAttendanceData(
  studentId: string,
  monthKey: string,
): Promise<{
  subjectWiseData: SubjectWiseAttendance[];
  dateWiseData: DateWiseAttendance[];
} | null> {
  const result = await getData<{
    subject_wise_data: string;
    date_wise_data: string;
  }>({
    table: 'attendance_data',
    studentId,
    additionalKeys: { month_key: monthKey },
    columns: ['subject_wise_data', 'date_wise_data'],
  });

  if (result) {
    return {
      subjectWiseData: JSON.parse(result.subject_wise_data) as SubjectWiseAttendance[],
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
    'SELECT month_key, subject_wise_data, date_wise_data FROM attendance_data WHERE student_id = ? ORDER BY month_key DESC',
    studentId,
  );

  return results.map((row) => ({
    monthKey: row.month_key,
    subjectWiseData: JSON.parse(row.subject_wise_data) as SubjectWiseAttendance[],
    dateWiseData: JSON.parse(row.date_wise_data) as DateWiseAttendance[],
  }));
}

export async function deleteAttendanceData(studentId: string): Promise<void> {
  await deleteData({
    table: 'attendance_data',
    studentId,
  });
}

export async function saveFeeData(
  studentId: string,
  feeLedger: FeeLedgerEntry[],
): Promise<void> {
  await saveData({
    table: 'fees_data',
    studentId,
    columns: ['fee_ledger'],
    values: [JSON.stringify(feeLedger)],
  });
}

export async function getFeeData(studentId: string): Promise<FeeLedgerEntry[] | null> {
  const result = await getData<{ fee_ledger: string }>({
    table: 'fees_data',
    studentId,
    columns: ['fee_ledger'],
  });

  if (result) {
    return JSON.parse(result.fee_ledger) as FeeLedgerEntry[];
  }

  return null;
}

export async function deleteFeeData(studentId: string): Promise<void> {
  await deleteData({
    table: 'fees_data',
    studentId,
  });
}

export async function saveAttendancePercentage(
  studentId: string,
  data: AttendancePercentageData,
): Promise<void> {
  await saveData({
    table: 'attendance_percentage',
    studentId,
    columns: ['total_class', 'attd', 'pcent', 'last_updated'],
    values: [data.total_class, data.attd, data.pcent, data.lastUpdated],
    includeTimestamps: false,
  });
}

export async function getAttendancePercentage(
  studentId: string,
): Promise<AttendancePercentageData | null> {
  const result = await getData<{
    student_id: string;
    total_class: number;
    attd: number;
    pcent: number;
    last_updated: string;
  }>({
    table: 'attendance_percentage',
    studentId,
    columns: ['student_id', 'total_class', 'attd', 'pcent', 'last_updated'],
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

export async function deleteAttendancePercentage(studentId: string): Promise<void> {
  await deleteData({
    table: 'attendance_percentage',
    studentId,
  });
}

export async function saveVirtualLabCourses(courses: VirtualLabCourse[]): Promise<void> {
  await saveData({
    table: 'virtual_labs_courses',
    studentId: GLOBAL_DATA_KEY,
    columns: ['courses_data'],
    values: [JSON.stringify(courses)],
  });
}

export async function getVirtualLabCourses(): Promise<VirtualLabCourse[] | null> {
  const result = await getData<{ courses_data: string }>({
    table: 'virtual_labs_courses',
    studentId: GLOBAL_DATA_KEY,
    columns: ['courses_data'],
  });

  if (result) {
    return JSON.parse(result.courses_data) as VirtualLabCourse[];
  }

  return null;
}

export async function deleteVirtualLabCourses(): Promise<void> {
  await deleteData({
    table: 'virtual_labs_courses',
    studentId: GLOBAL_DATA_KEY,
  });
}

export async function saveVirtualLabExperiments(
  course: string,
  stream: string,
  semester: string,
  experiments: VirtualLabExperiment[],
): Promise<void> {
  await saveData({
    table: 'virtual_labs_experiments',
    studentId: GLOBAL_DATA_KEY,
    additionalKeys: { course, stream, semester },
    columns: ['experiments_data'],
    values: [JSON.stringify(experiments)],
  });
}

export async function getVirtualLabExperiments(
  course: string,
  stream: string,
  semester: string,
): Promise<VirtualLabExperiment[] | null> {
  const result = await getData<{ experiments_data: string }>({
    table: 'virtual_labs_experiments',
    studentId: GLOBAL_DATA_KEY,
    additionalKeys: { course, stream, semester },
    columns: ['experiments_data'],
  });

  if (result) {
    return JSON.parse(result.experiments_data) as VirtualLabExperiment[];
  }

  return null;
}

export async function deleteVirtualLabExperiments(): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'DELETE FROM virtual_labs_experiments WHERE student_id = ?',
    GLOBAL_DATA_KEY,
  );
}

export async function saveLibraryBooks(
  studentId: string,
  filterType: string,
  books: LibraryBook[],
): Promise<void> {
  await saveData({
    table: 'library_books',
    studentId,
    additionalKeys: { filter_type: filterType },
    columns: ['books_data'],
    values: [JSON.stringify(books)],
  });
}

export async function getLibraryBooks(
  studentId: string,
  filterType: string,
): Promise<LibraryBook[] | null> {
  const result = await getData<{ books_data: string }>({
    table: 'library_books',
    studentId,
    additionalKeys: { filter_type: filterType },
    columns: ['books_data'],
  });

  if (result) {
    return JSON.parse(result.books_data) as LibraryBook[];
  }

  return null;
}

export async function saveSocialProfile(
  studentId: string,
  profile: SocialProfile,
): Promise<void> {
  await saveData({
    table: 'social_profiles',
    studentId,
    columns: ['social_data'],
    values: [JSON.stringify(profile)],
  });
}

export async function getSocialProfile(studentId: string): Promise<SocialProfile | null> {
  const result = await getData<{ social_data: string }>({
    table: 'social_profiles',
    studentId,
    columns: ['social_data'],
  });

  if (result) {
    return JSON.parse(result.social_data) as SocialProfile;
  }

  return null;
}

export async function saveScannedContact(
  scannedBy: string,
  payload: QRPayload,
): Promise<void> {
  const database = await getDatabase();
  const now = Date.now();
  const dataStr = JSON.stringify(payload);
  const studentId = payload.studentId;

  try {
    if (studentId) {
      // Upsert: on conflict (scanned_by, student_id) update payload + timestamp
      await database.runAsync(
        `INSERT INTO scanned_contacts (scanned_by, student_id, payload, timestamp)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(scanned_by, student_id) DO UPDATE SET
           payload = excluded.payload,
           timestamp = excluded.timestamp`,
        scannedBy,
        studentId,
        dataStr,
        now,
      );
    } else {
      await database.runAsync(
        'INSERT INTO scanned_contacts (scanned_by, payload, timestamp) VALUES (?, ?, ?)',
        scannedBy,
        dataStr,
        now,
      );
    }
  } catch (error) {
    console.error('Error saving scanned contact:', error);
    throw error;
  }
}

export async function getScannedContacts(scannedBy: string): Promise<ScannedContact[]> {
  const rows = await getAllData<{
    id: number;
    scanned_by: string;
    payload: string;
    timestamp: number;
  }>({
    table: 'scanned_contacts',
    columns: ['id', 'scanned_by', 'payload', 'timestamp'],
    whereColumn: 'scanned_by',
    whereValue: scannedBy,
    orderBy: 'timestamp DESC',
  });

  return rows.map((row) => ({
    id: row.id,
    scannedBy: row.scanned_by,
    payload: JSON.parse(row.payload),
    timestamp: row.timestamp,
  }));
}

export async function deleteScannedContact(id: number): Promise<void> {
  await deleteData({
    table: 'scanned_contacts',
    idColumn: 'id',
    idValue: id,
  });
}

export async function deleteLibraryBooks(studentId: string): Promise<void> {
  await deleteData({
    table: 'library_books',
    studentId,
  });
}

export async function deleteAllUserData(studentId: string): Promise<void> {
  const database = await getDatabase();

  await database.withTransactionAsync(async () => {
    await database.runAsync('DELETE FROM login_data WHERE student_id = ?', studentId);
    await database.runAsync('DELETE FROM user_data WHERE student_id = ?', studentId);
    await database.runAsync(
      'DELETE FROM attendance_data WHERE student_id = ?',
      studentId,
    );
    await database.runAsync('DELETE FROM fees_data WHERE student_id = ?', studentId);
    await database.runAsync(
      'DELETE FROM attendance_percentage WHERE student_id = ?',
      studentId,
    );
    await database.runAsync('DELETE FROM library_books WHERE student_id = ?', studentId);
    await database.runAsync(
      'DELETE FROM social_profiles WHERE student_id = ?',
      studentId,
    );
    await database.runAsync(
      'DELETE FROM scanned_contacts WHERE scanned_by = ?',
      studentId,
    );
  });
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
    DELETE FROM social_profiles;
    DELETE FROM scanned_contacts;
  `);
}
