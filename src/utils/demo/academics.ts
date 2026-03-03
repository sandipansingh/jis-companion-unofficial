import {
  AttendanceData,
  DateWiseAttendance,
  SubjectWiseAttendance,
} from '@/src/features/academics/types';

import { DEMO_FACULTY_LIST } from './feedback';

/**
 * Generate a list of recent ISO dates (YYYY-MM-DD), skipping Sundays.
 */
function getRecentDates(count: number = 10): string[] {
  const dates: string[] = [];
  const today = new Date();
  let daysAdded = 0;
  let daysBack = 0;

  while (daysAdded < count && daysBack < 30) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysBack);
    daysBack++;

    // Skip Sundays
    if (date.getDay() !== 0) {
      dates.push(date.toISOString().split('T')[0]);
      daysAdded++;
    }
  }

  return dates;
}

/**
 * Get time period for a subject based on period number
 */
function getTimePeriod(periodNum: number): string {
  const periods: { [key: number]: string } = {
    1: '1 (09.00-09.40)',
    2: '2 (09.40-10.20)',
    3: '3 (10.20-11.00)',
    4: '4 (11.00-11.40)',
    5: '5 (11.40-12.20)',
    6: '6 (12.20-01.00)',
    7: '7 (01.00-01.40)',
    8: '8 (01.40-02.20)',
  };
  return periods[periodNum] || `${periodNum} (09.00-09.40)`;
}

/**
 * Mock overall attendance summary returned in demo mode.
 */
export const DEMO_ATTENDANCE_DATA: AttendanceData = {
  total_class: 320,
  attd: 288,
  pcent: 90.0,
};

/**
 * Create mock subject-wise attendance entries for demo mode.
 */
export function getDemoSubjectAttendance(): SubjectWiseAttendance[] {
  const dates = getRecentDates(10);
  const attendance: SubjectWiseAttendance[] = [];

  // Get theory subjects (sub_type = 1) and lab subjects (sub_type = 0)
  const theorySubjects = DEMO_FACULTY_LIST.filter((f) => f.sub_type === 1);
  const labSubjects = DEMO_FACULTY_LIST.filter((f) => f.sub_type === 0);

  // Generate attendance for each date
  dates.forEach((date, dateIdx) => {
    const numTheoryClasses = 3 + (dateIdx % 2);

    let periodNum = 1;

    // Add theory classes
    theorySubjects.slice(0, numTheoryClasses).forEach((faculty, subIdx) => {
      const isAbsent = dateIdx % 5 === 4 && subIdx === numTheoryClasses - 1;
      const presentCount = 42 + (subIdx % 3);
      const absentCount = 3 - (subIdx % 3);

      attendance.push({
        date1: date,
        batch1: faculty.batch_id,
        CourseId1: faculty.course_id,
        StreamId1: faculty.stream_id,
        SectionId1: faculty.sec_id,
        SemesterId1: faculty.sem_id,
        SubjectId1: faculty.sub_id,
        subject_name: faculty.sub_name,
        emp_code: faculty.fac_code,
        faculty: faculty.fac_name,
        GroupId1: 1,
        Period1: periodNum,
        Period_name: getTimePeriod(periodNum),
        ctr1: 45,
        is_app: 1,
        present1: presentCount,
        absent1: absentCount,
        concat_data: '',
        stat: isAbsent ? 'Absent' : 'Present',
        upload1: '',
        upload2: '',
        upload3: '',
        upload4: '',
        upload5: '',
        assignment_id: 0,
        assignment_status: 0,
        assignment_marks: 0,
        feedback: 0,
      });

      periodNum++;
    });

    // Every 3rd day, add a lab class
    if (dateIdx % 3 === 0 && labSubjects.length > 0 && numTheoryClasses === 4) {
      const labIdx = Math.floor(dateIdx / 3) % labSubjects.length;
      const faculty = labSubjects[labIdx];

      // Replace the last theory class with a lab class
      attendance[attendance.length - 1] = {
        date1: date,
        batch1: faculty.batch_id,
        CourseId1: faculty.course_id,
        StreamId1: faculty.stream_id,
        SectionId1: faculty.sec_id,
        SemesterId1: faculty.sem_id,
        SubjectId1: faculty.sub_id,
        subject_name: faculty.sub_name,
        emp_code: faculty.fac_code,
        faculty: faculty.fac_name,
        GroupId1: 1,
        Period1: periodNum - 1,
        Period_name: getTimePeriod(periodNum - 1),
        ctr1: 45,
        is_app: 1,
        present1: 43,
        absent1: 2,
        concat_data: '',
        stat: dateIdx % 5 === 4 ? 'Absent' : 'Present',
        upload1: '',
        upload2: '',
        upload3: '',
        upload4: '',
        upload5: '',
        assignment_id: 0,
        assignment_status: 0,
        assignment_marks: 0,
        feedback: 0,
      };
    }
  });

  return attendance;
}

/**
 * Create mock date-wise attendance summary entries for demo mode.
 * This should match the actual number of classes generated in getDemoSubjectAttendance.
 */
export function getDemoDateAttendance(): DateWiseAttendance[] {
  const dates = getRecentDates(10);

  return dates.map((date, idx) => {
    const totalClasses = 3 + (idx % 2); // 3 or 4 classes
    const presentClasses = idx % 5 === 4 ? totalClasses - 1 : totalClasses; // Miss 1 class every 5th day

    return {
      rtDate: date,
      rtCount: totalClasses,
      rtPresent: presentClasses,
    };
  });
}
