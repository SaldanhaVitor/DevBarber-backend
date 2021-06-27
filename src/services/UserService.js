const User = require('../models/User');

class UserService {
    constructor() { }

    async create(body) {
        return await User.create(body);
    }

    async getUser(id) {
        return await User.findOne({ 'data.id': id });
    }

    async updateUserAppointments(id, boolean) {
        if (boolean) {
            let user = await this.getUser(id)
            const appointments = user.data.appointments + 1;

            await User.findOneAndUpdate(
                { 'data.id': id },
                { 'data.appointments': appointments }
            )

        } else {
            let user = await this.getUser(id)
            const appointments = user.data.appointments - 1;

            await User.findOneAndUpdate(
                { 'data.id': id },
                { 'data.appointments': appointments }
            )
        }
    }

}

module.exports = UserService;