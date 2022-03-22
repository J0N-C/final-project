export default function checkDate(date) {
  if (!date) {
    return 'N/A';
  } else {
    return `${date.slice(0, 10)}`;
  }
}
