const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = 60 * MS_IN_SECOND;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;

function pad(value: number, length: number) {
    return String(value).padStart(length, '0');
}

export function formatTimestamp(timestamp: number, showMilliseconds: boolean) {
    const hours = Math.floor(timestamp / MS_IN_HOUR);
    const minutes = Math.floor((timestamp % MS_IN_HOUR) / MS_IN_MINUTE);
    const seconds = Math.floor((timestamp % MS_IN_MINUTE) / MS_IN_SECOND);
    const milliseconds = timestamp % MS_IN_SECOND;

    const timeString = `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;

    return showMilliseconds
        ? `${timeString}:${pad(Math.floor(milliseconds / 10), 2)}`
        : timeString;
}