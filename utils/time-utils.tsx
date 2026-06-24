import { IntervalData, TimeConfiguration } from "@/data/data-types";

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

// MM:SS, rounded up to the nearest second — for the active timer's hero
// countdown and per-interval segment times, which never run long enough to
// need an hours digit.
export function formatMinutesSeconds(timestamp: number) {
    const roundedUp = Math.ceil(Math.max(timestamp, 0) / MS_IN_SECOND) * MS_IN_SECOND;
    const minutes = Math.floor(roundedUp / MS_IN_MINUTE);
    const seconds = Math.floor((roundedUp % MS_IN_MINUTE) / MS_IN_SECOND);
    return `${pad(minutes, 2)}:${pad(seconds, 2)}`;
}

export function calculateRoundTime(intervals: IntervalData[]): number {
    // Intervals are represented in milliseconds. Return total round time in ms.
    return intervals.reduce((acc, curr, i) => {
        // For every interval in the collection add the 'on' time for each repeat
        // and add the 'off' time except for the final repetition of the final interval.
        const timeOn: number = curr.on * curr.repeats;
        const timeOff: number = curr.off * (curr.repeats - (i === intervals.length - 1 ? 1 : 0));
        return acc + timeOn + timeOff;
    }, 0);
}

// Total time for the whole configuration, in ms: every round's time (which
// already excludes the trailing off period of the last interval), plus rest
// between rounds, excluding the rest period after the final round.
export function calculateTotalConfigurationTime(configuration: TimeConfiguration): number {
    const { intervals, numRounds, roundRest } = configuration;
    return calculateRoundTime(intervals) * numRounds + roundRest * (numRounds - 1);
}