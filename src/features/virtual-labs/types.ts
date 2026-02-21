export interface VirtualLabCourse {
  course_name: string;
  stream_name: string;
  sem_no: string;
}

export interface VirtualLabExperiment {
  sl: number;
  subject_code?: string;
  experiment: string;
  link: string;
}
