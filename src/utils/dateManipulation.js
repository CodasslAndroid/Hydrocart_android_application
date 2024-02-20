const month = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};
export function getDate(date) {
  const n_date = date?.slice(0, 2);
  const nmonth = date?.slice(3, 5);
  const year = date?.slice(6, 10);

  const n_month = month.hasOwnProperty(nmonth) ? month[nmonth] : nmonth;

  return `${n_date}-${n_month}-${year}`;
}
