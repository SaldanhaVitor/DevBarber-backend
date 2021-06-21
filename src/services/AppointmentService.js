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

        return this.updateAppointmentStatus(myAppointments);
    }

    async delete(appointmentId, token) {
        const user = token.payload.sub;

        await Appointment.remove(
            { appointment_id: appointmentId, user }
        );

        return await this.search(token);
    }

    async updateAppointmentStatus(appointments) {
        for (const ap of appointments) {
            if (!ap.old) {
                const appointmentDate = new Date(ap.year, ap.month, ap.day);
                let dateNow = new Date();
                const year = dateNow.getFullYear();
                const month = dateNow.getMonth() + 1;
                const day = dateNow.getDate();

                dateNow = new Date(parseInt(year), parseInt(month), parseInt(day));

                if (dateNow.getTime() > appointmentDate.getTime()){
                    await Appointment.findOneAndUpdate(
                        { appointment_id: ap.appointment_id },
                        { old: true }
                    )
                }
            }
        }
        return appointments;
    }
}

module.exports = AppointmentService;