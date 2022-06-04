/*
   Bicycle Health Interview - Get Availabile Time Ranges:
   -------------------------------------------------------

   Implement `getAvailableTimeRanges`. This function returns the available appointment time ranges for a
   provider for a given a date range. The time ranges must be greater than or equal to the duration
   of the appointment type the provider is trying to book.

   Also, please add additional test cases as needed.

   Considerations:
        - Provider calendars are stored in google calendar. Use `getCalenderEvents` to fetch this data.
        - Provider appointments are stored in an external EMR service. Use `getBookedAppointments` to
          fetch this data.

   Example:

   Assume `getAvailableTimeRanges` is called with a provider for whom we are trying to book a FOLLOWUP_30
   appointment from July 1, 2020 @ 1pm to July 1, 2020 @ 5pm. And assume that the provider has a single
   non-appointment calendar event on July 1, 2020 @ 1:45pm until July 1, 2020 @ 2:15pm. Also assume that
   the provider has a single booked NEW_PATIENT_60 appointment from July 1, 2020 @ 3pm - 4pm. Given the above,
   `getAvailableTimeRanges` should return the following available time ranges:
   - range 1: start: July 1, 2020 @ 1pm, end: July 1, 2020 @ 1:45pm
   - range 2: start: July 1, 2020 @ 2:15pm, end: July 1, 2020 @ 3:00pm
   - range 3: start: July 1, 2020 @ 4pm, end: July 1, 2020 @ 5pm

  For an example test see main.test.ts.

   NOTE: You are allowed to look things up on the internet and install any npm modules that you need.
*/
import { dateToUnix, parseRangesToUnix, parseUnixTimeRangesToTimeRanges } from './util/date'
import { mergeUnixTimeRanges, getRange, sortUnixTimeRanges } from './util/range'
import { GetCalendarEvents, GetBookedAppointments, TimeRange, UnixTimeRange } from './types'
import { AppointmentTypeId} from './enums'
import { AppointmentAvailabilityDeps  } from './interfaces'

export class AppointmentAvailability {
  private getCalendarEvents: GetCalendarEvents;
  private getBookedAppointments: GetBookedAppointments;

  constructor(deps: AppointmentAvailabilityDeps) {
    this.getCalendarEvents = deps.getCalendarEvents;
    this.getBookedAppointments = deps.getBookedAppointments;
  }

  async getAvailableTimeRanges(
    providerId: string,
    appointmentTypeId: AppointmentTypeId,
    start: Date,
    end: Date,
  ): Promise<TimeRange[]> {

    const startUnixTime = dateToUnix(start)
    const endUnixTime = dateToUnix(end)
    const calendarEvents = await this.getCalendarEvents(providerId, start, end)
    const bookedAppointments = await this.getBookedAppointments(providerId, start, end)
 
    const calendarEventsRanges = calendarEvents.map(getRange)
    const bookedAppointmentsRanges = bookedAppointments.map(getRange)
    const unixTimeRanges = parseRangesToUnix(calendarEventsRanges.concat(bookedAppointmentsRanges))

    const sortedUnixTimeRanges = sortUnixTimeRanges(unixTimeRanges)
    const mergedUnixTimeRanges = mergeUnixTimeRanges(sortedUnixTimeRanges)

    
    const availableUnixTimeRanges: Array<UnixTimeRange> = []
    for (let i = 0; i < mergedUnixTimeRanges.length; i++) {
      const unixTimeRange = mergedUnixTimeRanges[i]
      const obj : UnixTimeRange = { start: 0, end: 0 }
      if (i === 0) {
        if (startUnixTime < unixTimeRange.start) {
          obj.start = startUnixTime;
          obj.end = unixTimeRange.start;
        } else {
          continue;
        }
      } else {
        obj.start = mergedUnixTimeRanges[i - 1].end
        obj.end = unixTimeRange.start
      }
      availableUnixTimeRanges.push(obj)

      if (i === mergedUnixTimeRanges.length-1 && endUnixTime > mergedUnixTimeRanges[mergedUnixTimeRanges.length - 1].end) {
          availableUnixTimeRanges.push({
            start: mergedUnixTimeRanges[mergedUnixTimeRanges.length - 1].end,
            end: endUnixTime
          })
      }
    }

    return parseUnixTimeRangesToTimeRanges(availableUnixTimeRanges);
  }
}
