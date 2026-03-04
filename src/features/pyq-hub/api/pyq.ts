import { unofficialApiClient } from '@/src/api/client';

import { Pyq, PyqFetchParams, PyqListResponse } from '../types';

export const fetchPyqs = async (
  params: PyqFetchParams,
): Promise<{ data: Pyq[]; totalPages: number; total: number }> => {
  const {
    collegeCode,
    page = 1,
    limit = 50,
    subjectName,
    subjectCode,
    year,
    semester,
    stream,
  } = params;

  const queryParams: Record<string, string | number> = {
    collegeCode,
    page,
    limit,
  };

  if (subjectName && subjectName.trim().length >= 2) {
    queryParams.subjectName = subjectName.trim();
  }
  if (subjectCode && subjectCode.trim().length >= 1) {
    queryParams.subjectCode = subjectCode.trim();
  }
  if (year !== undefined && !isNaN(year)) {
    queryParams.year = year;
  }
  if (semester !== undefined && !isNaN(semester)) {
    queryParams.semester = semester;
  }
  if (stream && stream.trim().length >= 1) {
    queryParams.stream = stream.trim();
  }

  const response = await unofficialApiClient.get<PyqListResponse>('/pyq', {
    params: queryParams,
  });

  const { data, meta } = response.data;

  return {
    data: data ?? [],
    totalPages: meta?.pagination?.totalPages ?? 1,
    total: meta?.pagination?.total ?? 0,
  };
};
