import { UnixTimeRange, TimeRange } from "../types";
import { SECOND_IN_MILLISECONDS } from '../constants'
export const dateToUnix = (date: Date) : number => Math.floor(date.getTime() / SECOND_IN_MILLISECONDS)
const unixToDate = (unix: number) => new Date(unix * SECOND_IN_MILLISECONDS);
export const parseRangesToUnix = (events: Array<TimeRange>): Array<UnixTimeRange> =>  events.map(event => {
    const obj : UnixTimeRange = { start: 0, end: 0 }
    obj.start = dateToUnix(event.start)
    obj.end = dateToUnix(event.end) 
    return obj
})

export const parseUnixTimeRangesToTimeRanges = (events: Array<UnixTimeRange>): Array<TimeRange> => events.map(event => ({
    start: unixToDate(event.start),
    end: unixToDate(event.end)
}))

