import { UnixTimeRange, TimeRange, AppointmentType, CalendarEvent, Appointment } from '../types'
import { ONE_MINUTE_IN_MILLISECONDS } from '../constants'
import { getDurationMins } from './appointment'
export const mergeUnixTimeRanges = (ranges: Array<UnixTimeRange>): Array<UnixTimeRange> => {
    const result = [];
    let last;

    ranges.forEach(function (r) {
        if (!last || r.start > last.end)
            result.push(last = r);
        else if (r.end > last.end)
            last.end = r.end;
    });

    return result;
}


export const getRange = (obj: Appointment | CalendarEvent) : TimeRange => ({
        start: obj.start,
        end: (<CalendarEvent>obj).end || 
            ((<Appointment>obj).appointmentTypeId && 
            new Date(obj.start.getTime() + getDurationMins((<Appointment>obj).appointmentTypeId) * ONE_MINUTE_IN_MILLISECONDS))
})


export const sortUnixTimeRanges = (parsedDates): Array<UnixTimeRange> =>  parsedDates.sort((a, b) => {
        if (a.start < b.start) return -1;
        if (a.start > b.start) return 1;
        return 0;
    });
