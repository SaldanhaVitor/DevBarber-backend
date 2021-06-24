const Availability = require('../models/Availability');

class AvailabilityService {
    constructor() { }

    async create(body) {
        return await Availability.create(body);
    }

    async find(barberId) {
        return await Availability.find({ barberId });
    }

    async update({ barber, day, month, year, hour }) {
        const { id: barberId } = barber;

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        const date = `${year}-${month}-${day}`;

        try {
            const { available } = await Availability.findOne({ barberId });
            const barberDate = available.filter(av => av.date === date);

            if (barberDate.length > 0) {
                const barberHours = barberDate[0].hours;
                const barberHour = barberHours.indexOf(hour);
                barberHours.splice(barberHour, 1);
            }

            await Availability.findOneAndUpdate(
                { barberId },
                { available }
            )

            return await Availability.findOne({ barberId });

        } catch (error) {
            console.log(error)
        }

    }

    async revert({ barber, day, month, year, hour }) {
        const { id: barberId } = barber;

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        const date = `${year}-${month}-${day}`;

        try {
            const { available } = await Availability.findOne({ barberId });
            const barberDate = available.filter(av => av.date === date);

            if (barberDate.length > 0) {
                barberDate[0].hours.push(hour);
            }

            await Availability.findOneAndUpdate(
                { barberId },
                { available }
            )

            return await Availability.findOne({ barberId });

        } catch (error) {
            console.log(error)
        }

    }
}

module.exports = AvailabilityService;