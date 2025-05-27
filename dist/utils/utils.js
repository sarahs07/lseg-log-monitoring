"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTime = parseTime;
exports.getDuration = getDuration;
function parseTime(timeString) {
    var _a = timeString
        .split(":")
        .map(function (value) { return Number(value); }), hours = _a[0], minutes = _a[1], seconds = _a[2];
    return hours * 3600 + minutes * 60 + seconds;
}
function getDuration(end, start) {
    return end - start;
}
