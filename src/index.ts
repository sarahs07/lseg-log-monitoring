import * as fs from "fs";
import * as path from "path";

class LogsMonitoring {
  filePath: string | undefined = undefined;

  constructor(filePath) {
    this.filePath = filePath;
  }

  async processLogs() {
    let jobs;
    // Read logfile asynchronously
    const data = await this.readLogFile();

    // Process file data
    if (typeof data === "string") {
      jobs = this.processLogEntries(data);
    }

    // Check start and finish time to check for trushhold breaches.

    this.generateReport(jobs);
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

  private processLogEntries(data: string) {
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
          startTime: this.parseTime(timeString),
        });
      }

      if (status.trim() === "END") {
        const entry = map.get(pid);
        if (entry) {
          map.set(pid, {
            ...entry,
            endTime: this.parseTime(timeString),
            duration: this.getDuration(
              this.parseTime(timeString),
              entry.startTime
            ),
          });
        }
      }
    });

    //console.log(">>map", map);
    return map;
  }

  private parseTime(timeString: string) {
    const [hours, minutes, seconds] = timeString
      .split(":")
      .map((value) => Number(value));

    return hours * 3600 + minutes * 60 + seconds;
  }

  private getDuration(end, start) {
    return end - start;
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
