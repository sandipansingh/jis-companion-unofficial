export interface AttendanceData {
  total_class: number;
  attd: number;
  pcent: number;
}

export interface DateWiseAttendance {
  rtDate: string;
  rtCount: number;
  rtPresent: number;
}

export interface SubjectWiseAttendance {
  date1: string;
  batch1: number;
  CourseId1: number;
  StreamId1: number;
  SectionId1: number;
  SemesterId1: number;
  SubjectId1: number;
  subject_name: string;
  emp_code: string;
  faculty: string;
  GroupId1: number;
  Period1: number;
  Period_name: string;
  ctr1: number;
  is_app: number;
  present1: number;
  absent1: number;
  concat_data: string;
  stat: string;
  upload1: string;
  upload2: string;
  upload3: string;
  upload4: string;
  upload5: string;
  assignment_id: number;
  assignment_status: number;
  assignment_marks: number;
  feedback: number;
}
