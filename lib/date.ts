export function currentYearMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
