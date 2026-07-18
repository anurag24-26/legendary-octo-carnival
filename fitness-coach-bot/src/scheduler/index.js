import { scheduleDailyReports } from "./dailyReport.js";
import { scheduleAlerts } from "./alerts.js";

export function startSchedulers(bot) {
  scheduleDailyReports(bot);
  scheduleAlerts(bot);
}
