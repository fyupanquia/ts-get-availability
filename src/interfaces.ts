import { GetCalendarEvents, GetBookedAppointments } from './types'
export interface AppointmentAvailabilityDeps {
    getCalendarEvents: GetCalendarEvents;
    getBookedAppointments: GetBookedAppointments;
}