export function parseTime(timeString: string) {
  const [hours, minutes, seconds] = timeString
    .split(":")
    .map((value) => Number(value));

  return hours * 3600 + minutes * 60 + seconds;
}

export function getDuration(end, start) {
  return end - start;
}
