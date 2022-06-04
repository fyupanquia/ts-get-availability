import { appointmentTypes } from '../constants'
import { AppointmentTypeId } from '../enums';
export const getDurationMins = (appointmentTypeId: AppointmentTypeId) => {
    const found = appointmentTypes.find(e => e.appointmentTypeId === appointmentTypeId)
    return found.durationMins
}