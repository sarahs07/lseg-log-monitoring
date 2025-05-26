"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var LogsMonitoring = /** @class */ (function () {
    function LogsMonitoring(filePath) {
        this.filePath = undefined;
        this.filePath = filePath;
    }
    LogsMonitoring.prototype.processLogs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var jobs, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readLogFile()];
                    case 1:
                        data = _a.sent();
                        // Process file data
                        if (typeof data === "string") {
                            jobs = this.processLogEntries(data);
                        }
                        // Check start and finish time to check for trushhold breaches.
                        this.generateReport(jobs);
                        return [2 /*return*/];
                }
            });
        });
    };
    LogsMonitoring.prototype.readLogFile = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.readFile(_this.filePath, { encoding: "utf-8" }, function (error, data) {
                if (error) {
                    reject(error);
                }
                resolve(data);
            });
        });
    };
    LogsMonitoring.prototype.processLogEntries = function (data) {
        var _this = this;
        var entries = data.trim().split("\n");
        var map = new Map();
        entries.forEach(function (entry) {
            if (entry.split(",").length < 4) {
                throw "Invalid log entry";
            }
            var _a = entry.split(","), timeString = _a[0], description = _a[1], status = _a[2], pid = _a[3];
            if (status.trim() === "START") {
                map.set(pid, {
                    timeString: timeString,
                    description: description,
                    startTime: _this.parseTime(timeString),
                });
            }
            if (status.trim() === "END") {
                var entry_1 = map.get(pid);
                if (entry_1) {
                    map.set(pid, __assign(__assign({}, entry_1), { endTime: _this.parseTime(timeString), duration: _this.getDuration(_this.parseTime(timeString), entry_1.startTime) }));
                }
            }
        });
        //console.log(">>map", map);
        return map;
    };
    LogsMonitoring.prototype.parseTime = function (timeString) {
        var _a = timeString
            .split(":")
            .map(function (value) { return Number(value); }), hours = _a[0], minutes = _a[1], seconds = _a[2];
        return hours * 3600 + minutes * 60 + seconds;
    };
    LogsMonitoring.prototype.getDuration = function (end, start) {
        return end - start;
    };
    LogsMonitoring.prototype.generateReport = function (jobs) {
        jobs.forEach(function (job, key) {
            var durationMinutes = job.duration / 60;
            if (durationMinutes > 10) {
                console.error("Job ".concat(key, " took more than 10 mins"));
                return;
            }
            if (durationMinutes > 5) {
                console.warn("Job ".concat(key, " took more than 5 mins"));
            }
        });
    };
    return LogsMonitoring;
}());
// Usage:
var logsMonitoring = new LogsMonitoring(path.join(__dirname, "../src/logs.log"));
logsMonitoring.processLogs();
