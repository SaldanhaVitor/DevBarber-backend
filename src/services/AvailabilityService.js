const Availability = require('../models/Availability');

class AvailabilityService {
    constructor() { }

    async create(body) {
        const { barberId, available } = body;
        const barber = await this.find(barberId);
        if (barber.length > 0)
            return await Availability.findOneAndUpdate(
                { barberId },
                { available }
            );

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
                function compare(a, b) {
                    var time1 = parseFloat(a.replace(':', '.').replace(/[^\d.-]/g, ''));
                    var time2 = parseFloat(b.replace(':', '.').replace(/[^\d.-]/g, ''));
                    if (a.match(/.*pm/)) time1 += 12; if (b.match(/.*pm/)) time2 += 12;
                    if (time1 < time2) return -1;
                    if (time1 > time2) return 1;
                    return 0;
                }
                barberDate[0].hours.sort(compare);
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