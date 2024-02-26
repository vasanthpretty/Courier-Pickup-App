import * as dayjs from "dayjs";
// Making Date to human friendly
export function formatMyDate(date) {
  return dayjs(date).format("DD-MMM-YYYY HH:MM a");
}
// const previousDate = formatMyDate("1981-09-18T11:32");
// const currentDate = formatMyDate();
// console.log(previousDate);
// console.log(currentDate);
