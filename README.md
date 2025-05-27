This is a basic implementation of a log file monitoring to report if any of the jobs go over the threshold limits of 5 or 10 mins. 

**Usage:**

Run `npm run serve` with the following code in `index.ts` 

```
const logsMonitoring = new LogsMonitoring(
  path.join(__dirname, "../src/logs.log")
);
logsMonitoring.processLogs();
```

**ToDo:**
- Can be further modularised to help with unit testing of the processing of the module entries in `processLogEntries`.
- Unit tests need to be written to test for outputs with different input files and processing of different log entries.
- More error handling to be added e.g. if no fileName provided. 
- Types can be more refined.
