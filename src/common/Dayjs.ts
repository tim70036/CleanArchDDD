import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";

function InitDayjs(): void {
  dayjs.extend(utc);
  dayjs.extend(duration);
}

export { InitDayjs };
