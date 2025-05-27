import * as fs from "fs";
import * as path from "path";
import { getDuration, parseTime } from "./utils/utils";

export class LogsMonitoring {
  filePath: string | undefined = undefined;

  constructor(filePath) {
    this.filePath = filePath;
  }

  public async processLogs() {
    try {
      let jobs, data;
      // Read logfile asynchronously
      data = await this.readLogFile();

      // Process file data
      if (typeof data === "string" && data.length > 0) {
        jobs = this.processLogEntries(data);
      } else {
        throw "Logs file is empty";
      }
      console.log(">>jobs", jobs);
      // Check start and finish time to check for trushhold breaches.
      this.generateReport(jobs);
    } catch (e) {
      throw `Error in processLogs: ${e}`;
    }
  }

  private readLogFile(): Promise<string | Error> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, { encoding: "utf-8" }, (error, data) => {
        if (error) {
          reject(error);
        }

        resolve(data);
      });
    });
  }

  private processLogEntries(
    data: string
  ): Map<string, Record<string, string | number>> {
    const entries = data.trim().split("\n");

    const map = new Map();

    entries.forEach((entry) => {
      if (entry.split(",").length < 4) {
        throw "Invalid log entry";
      }

      const [timeString, description, status, pid] = entry.split(",");
      if (status.trim() === "START") {
        map.set(pid, {
          timeString,
          description,
          startTime: parseTime(timeString),
        });
      }

      if (status.trim() === "END") {
        const entry = map.get(pid);
        if (entry) {
          map.set(pid, {
            ...entry,
            endTime: parseTime(timeString),
            duration: getDuration(parseTime(timeString), entry.startTime),
          });
        }
      }
    });

    return map;
  }

  private generateReport(jobs) {
    jobs.forEach((job, key) => {
      const durationMinutes = job.duration / 60;

      if (durationMinutes > 10) {
        console.error(`Job ${key} took more than 10 mins`);
        return;
      }

      if (durationMinutes > 5) {
        console.warn(`Job ${key} took more than 5 mins`);
      }
    });
  }
}

// Usage:

const logsMonitoring = new LogsMonitoring(
  path.join(__dirname, "../src/logs.log")
);
logsMonitoring.processLogs();
