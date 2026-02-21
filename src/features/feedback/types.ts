export interface FeedbackLockStatus {
  locStatus: number; // 0 = unlocked, 1 = locked
}

export interface FacultyFeedbackItem {
  session_id: number;
  batch_id: number;
  sem_id: number;
  course_id: number;
  stream_id: number;
  sub_id: number;
  sub_code: string;
  sub_name: string;
  sec_id: number;
  fac_code: string;
  fac_sht_name: string;
  fac_name: string;
  sub_type: number; // 0 = Lab, 1 = Theory
  app: string;
  pending: number;
  done: number;
  sec_name: string;
  fac_image: string;
  totalRating: number; // 0 = not submitted, 100 = submitted, -10 = not opted
}

export interface FeedbackQuestion {
  id: number;
  prefix: string;
  head: string;
  subhead: string;
  rating: number; // 1-10
}

export interface FeedbackSaveResponse {
  err_mesg: string;
  err_no: number;
  doc_no: string;
  doc_id: number;
}
