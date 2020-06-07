export function transformStatistics(statistics) {
  for (let item of statistics) {
    item.day = new Date(item.dateTime).toString().substr(0, 3);
  }
  return statistics;
}