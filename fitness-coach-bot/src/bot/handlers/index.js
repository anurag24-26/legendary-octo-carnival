import { startCommand } from "../commands/start.js";
import { helpCommand } from "../commands/help.js";
import { todayCommand } from "../commands/today.js";
import { doneCommand } from "../commands/done.js";
import { skipCommand } from "../commands/skip.js";
import { historyCommand } from "../commands/history.js";
import { sleepCommand } from "../commands/sleep.js";
import { foodCommand } from "../commands/food.js";
import { proteinCommand } from "../commands/protein.js";
import { waterCommand } from "../commands/water.js";
import { weightCommand } from "../commands/weight.js";
import { waistCommand } from "../commands/waist.js";
import { noteCommand } from "../commands/note.js";
import { photoCommand } from "../commands/photo.js";
import { coachCommand } from "../commands/coach.js";
import { progressCommand } from "../commands/progress.js";
import { reportCommand } from "../commands/report.js";
import { settingsCommand } from "../commands/settings.js";
import { exportCommand } from "../commands/export.js";
import { handlePhotoMessage } from "./photoHandler.js";
import { handleTextMessage } from "./textHandler.js";

export function registerCommands(bot) {
  bot.command("start", startCommand);
  bot.command("help", helpCommand);
  bot.command("today", todayCommand);
  bot.command("done", doneCommand);
  bot.command("skip", skipCommand);
  bot.command("history", historyCommand);
  bot.command("sleep", sleepCommand);
  bot.command("food", foodCommand);
  bot.command("protein", proteinCommand);
  bot.command("water", waterCommand);
  bot.command("weight", weightCommand);
  bot.command("waist", waistCommand);
  bot.command("note", noteCommand);
  bot.command("photo", photoCommand);
  bot.command("coach", coachCommand);
  bot.command("progress", progressCommand);
  bot.command("report", reportCommand);
  bot.command("settings", settingsCommand);
  bot.command("export", exportCommand);

  bot.on("message:photo", handlePhotoMessage);
  bot.on("message:text", handleTextMessage);
}
