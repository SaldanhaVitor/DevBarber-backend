const Appointment = require('../models/Appointment');

class AppointmentService {
    constructor() { }

    async create(token, body) {
        body.user = token.payload.sub;
        return await Appointment.create(body);
    }

    async search(token) {
        const user = token.payload.sub;
        return await Appointment.find({ user });
    }
}

module.exports = AppointmentService;