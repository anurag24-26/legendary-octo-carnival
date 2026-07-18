import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { env } from "../config/env.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export function now() {
  return dayjs().tz(env.TIMEZONE);
}

export function today() {
  return now().format("YYYY-MM-DD");
}

export function daysAgo(n) {
  return now().subtract(n, "day").format("YYYY-MM-DD");
}

export function daysBetween(dateA, dateB) {
  return dayjs(dateB).diff(dayjs(dateA), "day");
}

export function isSameOrAfter(date, referenceDate) {
  return dayjs(date).isSame(referenceDate) || dayjs(date).isAfter(referenceDate);
}

export function formatHuman(date) {
  return dayjs(date).format("Do MMM YYYY");
}

export function startOfWeek() {
  return now().startOf("week").format("YYYY-MM-DD");
}

export function startOfMonth() {
  return now().startOf("month").format("YYYY-MM-DD");
}
