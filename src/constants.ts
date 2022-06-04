import { AppointmentTypeId } from './enums'
import { AppointmentType } from './types'
export const appointmentTypes: AppointmentType[] = [
    {
        appointmentTypeId: AppointmentTypeId.FOLLOWUP_15,
        name: '15 min Follow Up',
        durationMins: 15,
    },
    {
        appointmentTypeId: AppointmentTypeId.FOLLOWUP_30,
        name: '30 min Follow Up',
        durationMins: 30,
    },
    {
        appointmentTypeId: AppointmentTypeId.NEW_PATIENT_60,
        name: '60 min New Patient',
        durationMins: 60,
    },
];
const MINUTE_IN_SECONDS = 60
export const SECOND_IN_MILLISECONDS = 1000
export const ONE_MINUTE_IN_MILLISECONDS = SECOND_IN_MILLISECONDS * MINUTE_IN_SECONDS