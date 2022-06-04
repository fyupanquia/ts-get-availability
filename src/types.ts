import { AppointmentTypeId  } from './enums'

export type Appointment = {
    appointmentId: string;
    appointmentTypeId: AppointmentTypeId;
    start: Date;
};

export type CalendarEvent = {
    calenderEventId: string;
    start: Date;
    end: Date;
};

export type GetCalendarEvents = (
    providerId: string,
    start: Date,
    end: Date,
) => Promise<CalendarEvent[]>;

export type GetBookedAppointments = (
    providerId: string,
    start: Date,
    end: Date,
) => Promise<Appointment[]>;

export type AppointmentType = {
    appointmentTypeId: AppointmentTypeId;
    name: string;
    durationMins: number;
};
export type TimeRange = {
    start: Date;
    end: Date;
};
export type UnixTimeRange = {
    start: number;
    end: number;
};