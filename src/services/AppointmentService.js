const Appointment = require('../models/Appointment');

class AppointmentService {
    constructor() { }

    async create(token, body) {
        body.user = token.payload.sub;
        return await Appointment.create(body);
    }

    async search(token) {
        const user = token.payload.sub;
        let appointments = await Appointment.find({ user });
        return appointments = appointments.map(ap => {
            ap.datetime = ap.year + '-' + ap.month + '-' + ap.day + ' ' + ap.hour + ':' + '00';
            return {
                datetime: ap.datetime,
                barber: ap.barber,
                service: ap.service
            }
        });
    }
}

module.exports = AppointmentService;