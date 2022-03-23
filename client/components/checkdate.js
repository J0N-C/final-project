export default function checkDate(date) {
  if (!date) {
    return 'N/A';
  } else {
    const formattedDate = new Date(date);
    const [, month, day, year] = formattedDate.toString().split(' ');
    return `${month}. ${day}, ${year}`;
  }
}
