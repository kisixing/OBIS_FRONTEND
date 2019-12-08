
export function countWeek(date){
  if (!date) {
    return '';
  }
  var days = Math.floor(((new Date() - new Date(date)) / (1000 * 3600) + 8) / 24);
  return `${Math.floor(days / 7)}+${days % 7}`;
}
