import { FeeLedgerEntry } from '@/src/features/fees/types';

/**
 * Generate demo fee ledger entries
 */
export function getDemoFeeData(): FeeLedgerEntry[] {
  return [
    {
      vou_date: '15/05/2025',
      mr_no: 'MR/2025/001234',
      chq_no: 'CHQ123456',
      act_amt: -99000,
      bill_amt: 0,
      recd_amt: 99000,
      bill_type_name: 'Collection',
      sem_name: '1',
      bal_amt: -99000,
    },
    {
      vou_date: '15/05/2025',
      mr_no: 'MR/2025/001235',
      chq_no: 'CHQ123457',
      act_amt: -2125,
      bill_amt: 0,
      recd_amt: 2125,
      bill_type_name: 'Collection',
      sem_name: '1',
      bal_amt: -101125,
    },
    {
      vou_date: '01/07/2025',
      mr_no: 'NA',
      chq_no: 'NA',
      act_amt: 91425,
      bill_amt: 91425,
      recd_amt: 0,
      bill_type_name: 'Bill',
      sem_name: '1',
      bal_amt: -9700,
    },
  ];
}

/**
 * Calculate total fees summary for demo account
 */
export function getDemoFeeSummary() {
  const feeData = getDemoFeeData();
  const totalBilled = feeData.reduce((sum, entry) => sum + entry.bill_amt, 0);
  const totalPaid = feeData.reduce((sum, entry) => sum + entry.recd_amt, 0);
  const totalBalance = feeData.reduce((sum, entry) => sum + entry.bal_amt, 0);

  return {
    totalBilled,
    totalPaid,
    totalBalance,
  };
}
