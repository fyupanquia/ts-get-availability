import {
  AppointmentAvailability,
} from '../src/main';
import { TimeRange } from '../src/types'
import { AppointmentTypeId } from '../src/enums'
import { AppointmentAvailabilityDeps } from '../src/interfaces'

describe('AppointmentAvailability', () => {
  const provider1Id = 'provider-1';
  
  it('correctly returns availability with a single booked appointment and calendar event', async () => {
    const deps: AppointmentAvailabilityDeps = {
      getCalendarEvents: async (providerId: string, start: Date, end: Date) => {
        return [
          {
            calenderEventId: 'calendar-1',
            start: new Date('2020-07-01T13:45:00.000Z'),
            end: new Date('2020-07-01T14:15:00.000Z'),
          },
        ];
      },
      getBookedAppointments: async (
        providerId: string,
        start: Date,
        end: Date,
      ) => {
        return [
          {
            appointmentId: 'appointment-1',
            appointmentTypeId: AppointmentTypeId.NEW_PATIENT_60,
            start: new Date('2020-07-01T15:00:00.000Z'),
          },
        ];
      },
    };

    const appointmentAvailability = new AppointmentAvailability(deps);
    const start = new Date('2020-07-01T13:00:00.000Z');
    const end = new Date('2020-07-01T17:00:00.000Z');

    const result = await appointmentAvailability.getAvailableTimeRanges(
      provider1Id,
      AppointmentTypeId.FOLLOWUP_30,
      start,
      end,
    );

    const expectedResult: TimeRange[] = [
      {
        // - range 1: start: July 1, 2020 @ 1pm, end: July 1, 2020 @ 1:45pm
        start: new Date('2020-07-01T13:00:00.000Z'),
        end: new Date('2020-07-01T13:45:00.000Z'),
      },
      {
        // - range 2: start: July 1, 2020 @ 2:15pm, end: July 1, 2020 @ 3:00pm
        start: new Date('2020-07-01T14:15:00.000Z'),
        end: new Date('2020-07-01T15:00:00.000Z'),
      },
      {
        // - range 3: start: July 1, 2020 @ 4pm, end: July 1, 2020 @ 5pm
        start: new Date('2020-07-01T16:00:00.000Z'),
        end: new Date('2020-07-01T17:00:00.000Z'),
      },
    ];

    expect(result).toEqual(expectedResult);
  });
  

  it('correctly returns availability with a single booked appointment and calendar event with merged ranges', async () => {
    const deps: AppointmentAvailabilityDeps = {
      getCalendarEvents: async (providerId: string, start: Date, end: Date) => {
        return [
          {
            calenderEventId: 'calendar-1',
            start: new Date('2022-04-26T13:45:00.000Z'),
            end: new Date('2022-04-26T14:15:00.000Z'),
          },
          {
            calenderEventId: 'calendar-1',
            start: new Date('2022-04-26T14:45:00.000Z'),
            end: new Date('2022-04-26T15:15:00.000Z'),
          },
        ];
      },
      getBookedAppointments: async (
        providerId: string,
        start: Date,
        end: Date,
      ) => {
        return [
          {
            appointmentId: 'appointment-1',
            appointmentTypeId: AppointmentTypeId.NEW_PATIENT_60,
            start: new Date('2022-04-26T14:00:00.000Z'),
          },
        ];
      },
    };

    const appointmentAvailability = new AppointmentAvailability(deps);
    const start = new Date('2022-04-26T13:00:00.000Z');
    const end = new Date('2022-04-26T17:00:00.000Z');

    const result = await appointmentAvailability.getAvailableTimeRanges(
      provider1Id,
      AppointmentTypeId.FOLLOWUP_30,
      start,
      end,
    );

    const expectedResult: TimeRange[] = [
      {
        // - range 1: start: April 26, 2022 @ 1pm, end: April 26, 2022 @ 1:45pm
        start: new Date('2022-04-26T13:00:00.000Z'),
        end: new Date('2022-04-26T13:45:00.000Z'),
      },
      {
        // - range 2: start: April 26, 2022 @ 3:15pm, end: April 26, 2022 @ 5:00pm
        start: new Date('2022-04-26T15:15:00.000Z'),
        end: new Date('2022-04-26T17:00:00.000Z'),
      },
    ];

    expect(result).toEqual(expectedResult);
  });
});
