const Appointment = require('../models/Appointment');

class AppointmentService {
    constructor() { }

    async create(token, body) {
        body.user = token.payload.sub;
        return await Appointment.create(body);
    }

    async search(token) {
        const user = token.payload.sub;
        const myAppointments = await Appointment.find({ user });

        if (myAppointments.length > 0) {
            myAppointments.sort(function (a, b) {
                return (a.created_at > b.created_at) ? -1 : ((a.created_at < b.created_at) ? 1 : 0);
            });
        }

        return myAppointments;
    }

    async update(appointmentId, token, boolean) {
        const user = token.payload.sub;

        await Appointment.findOneAndUpdate(
            { appointment_id: appointmentId, user },
            { canceled: boolean }
        );
        return await Appointment.findOne({ appointment_id: appointmentId, user });
    }
}

module.exports = AppointmentService;