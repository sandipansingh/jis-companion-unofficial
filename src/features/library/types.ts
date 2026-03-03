export interface LibraryBook {
  acc_type_id: number;
  acc_type: string;
  reader_id: number;
  reader_code: string;
  reader_name: string;
  reader_dept: string;
  reader_acc_id: number;
  reader_acc_no: string;
  reader_acc_name: string;
  issue_date: string;
  return_date: string;
  return_id: number;
  act_return_date?: string;
}

export type LibraryFilterType = '1' | '2'; // 1 = all, 2 = pending

export interface LibrarySearchResult {
  sl_no: number;
  acc_title: string;
  acc_edition: string;
  acc_author: string;
  acc_subject: string;
  tot_copy: number;
  tot_shelf: number;
  tot_issued: number;
  tot_ref_book: number;
  m_sel: string;
  m_book: string;
}

export type LibrarySearchField =
  | 'acc_title'
  | 'acc_author_name'
  | 'acc_call'
  | 'acc_isbn';
