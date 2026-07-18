import {
  sleepLogs,
  recoveryLogs,
  proteinLogs,
  waterLogs,
  weightLogs,
  waistLogs,
} from "../schema.js";
import { createLogRepository } from "./createLogRepository.js";

export const sleepRepository = createLogRepository(sleepLogs);
export const recoveryRepository = createLogRepository(recoveryLogs);
export const proteinRepository = createLogRepository(proteinLogs);
export const waterRepository = createLogRepository(waterLogs);
export const weightRepository = createLogRepository(weightLogs);
export const waistRepository = createLogRepository(waistLogs);
