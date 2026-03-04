export interface Pyq {
  $id: string;
  driveFileId: string;
  originalFileName: string;
  driveLink: string;
  mimeType: string;
  collegeName: string;
  collegeCode: string;
  subjectCode: string;
  subjectName: string;
  year: number;
  program: string;
  semester: number;
  examType: string;
  streams: string[];
  viewUrl: string;
  downloadUrl: string;
}

export interface PyqPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PyqListResponse {
  success: boolean;
  message: string;
  data: Pyq[];
  meta: {
    pagination: PyqPagination;
  };
}

export type PyqSearchFilter =
  | 'subjectName'
  | 'subjectCode'
  | 'year'
  | 'stream'
  | 'semester';

export interface PyqFilterOption {
  label: string;
  value: PyqSearchFilter;
  placeholder: string;
}

export const PYQ_FILTER_OPTIONS: PyqFilterOption[] = [
  { label: 'Name', value: 'subjectName', placeholder: 'Search by subject name...' },
  { label: 'Code', value: 'subjectCode', placeholder: 'Search by subject code...' },
  { label: 'Year', value: 'year', placeholder: 'Filter by year (e.g. 2024)...' },
  { label: 'Stream', value: 'stream', placeholder: 'Filter by stream...' },
  { label: 'Semester', value: 'semester', placeholder: 'Filter by semester (1–8)...' },
];

export interface PyqFetchParams {
  collegeCode: string;
  page?: number;
  limit?: number;
  subjectName?: string;
  subjectCode?: string;
  year?: number;
  semester?: number;
  stream?: string;
}

export interface College {
  name: string;
  code: string;
  description: string;
}

export const COLLEGES: College[] = [
  {
    name: 'Narula Institute of Technology',
    code: 'nit',
    description: 'B.Tech, MBA, MCA & more — Agarpara, Kolkata',
  },
];
