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
}

module.exports = AppointmentService;