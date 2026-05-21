import type { AdminUser } from '@/lib/types/admin';
import {
  formatGender,
  getUserDisplayName,
  getUserStatusLabel,
} from '@/lib/user-display';

export type UserTableExportRow = {
  Name: string;
  Phone: string;
  Email: string;
  Gender: string;
  Avatar: string;
  Tier: string;
  Streak: number;
  Wallet: number;
  Status: string;
};

export function usersToExportRows(users: AdminUser[]): UserTableExportRow[] {
  return users.map((u) => ({
    Name: getUserDisplayName(u),
    Phone: u.phone || u.id,
    Email: u.email || '—',
    Gender: formatGender(u.gender),
    Avatar: u.avatar?.trim() || '—',
    Tier: u.subscriptionTier || '—',
    Streak: u.currentStreakDays,
    Wallet: u.walletBalance,
    Status: getUserStatusLabel(u),
  }));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportUsersToExcel(users: AdminUser[], filename = 'persistify-users.xlsx') {
  const XLSX = await import('xlsx');
  const rows = usersToExportRows(users);
  const sheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Users');
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  downloadBlob(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    filename,
  );
}

export async function exportUsersToPdf(users: AdminUser[], filename = 'persistify-users.pdf') {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;
  const rows = usersToExportRows(users);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  doc.setFontSize(14);
  doc.text('Persistify — Users export', 40, 36);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generated ${new Date().toLocaleString('en-IN')} · ${rows.length} users`, 40, 52);

  if (rows.length === 0) {
    doc.text('No users to export.', 40, 72);
    doc.save(filename);
    return;
  }

  autoTable(doc, {
    startY: 64,
    head: [Object.keys(rows[0])],
    body: rows.map((r) => Object.values(r)),
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [79, 70, 229] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 40, right: 40 },
  });

  doc.save(filename);
}
