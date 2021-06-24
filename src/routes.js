const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');
const Post = require('./models/Post');

const DecodeService = require('./services/DecodeService');
const AppointmentService = require('./services/AppointmentService');
const AvailabilityService = require('./services/AvailabilityService');

const DecodeToken = new DecodeService();
const AppointmentServices = new AppointmentService();
const AvailabilityServices = new AvailabilityService();

routes.post('/posts', multer(multerConfig).single('file'), async (req, res) => {
    const { originalname: name, size, key, location: url = '' } = req.file;
    const post = await Post.create({
        name,
        size,
        key,
        url
    })
    return res.status(201).send(post);
});

routes.get('/posts', async (req, res) => {
    const posts = await Post.find();
    if (posts.length > 0) {
        return res.status(200).send(posts);
    }
    return res.status(404).send({ message: 'No one post found' });
})

routes.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (post) {
        await post.remove();
        return res.status(200).send({ result: 'success' });
    }
    return res.status(404).send({ message: `Post with id ${id} not found` });
})

routes.post('/availability', async (req, res) => {
    const { barberId, available } = req.body;
    const barberAvailable = await AvailabilityServices.create({
        barberId,
        available
    });
    return res.status(201).send(barberAvailable);
});

routes.get('/availability/:barberId', async (req, res) => {
    const { barberId } = req.params;
    const barberAvailable = await AvailabilityServices.find(barberId);
    if (barberAvailable.length > 0) {
        return res.status(200).send(...barberAvailable);
    }
    return res.status(404).send({ message: `No availability for barber ${barberId}` });
});

routes.post('/decode', async (req, res) => {
    const { token } = req.body;

    const decoded = await DecodeToken.execute(token);

    if (decoded)
        return res.status(200).send(decoded);

    return res.status(400).send({ error: 'errorMessage' });
});

routes.post('/appointment', async (req, res) => {
    const { token } = req.headers;
    const { body } = req;

    const decoded = await DecodeToken.execute(token);
    const appointment = await AppointmentServices.create(decoded, body);
    if (appointment) {
        const { available } = await AvailabilityServices.update(body);
        return res.status(201).send({ ...appointment._doc, status: 201, newAvailable: available });
    }
    return res.status(400).send({ error: 'Some error occur', status: 400 });;
});

routes.get('/appointments', async (req, res) => {
    const { token } = req.headers;

    const decoded = await DecodeToken.execute(token);
    const myAppointments = await AppointmentServices.search(decoded);

    if (myAppointments.length > 0)
        return res.status(200).send(myAppointments);

    return res.status(404).send({ error: 'No appointment found' });
});

routes.delete('/appointment/:appointmentId', async (req, res) => {
    const { token } = req.headers;
    const { appointmentId } = req.params;
    const body = req.body;

    const decoded = await DecodeToken.execute(token);
    const myAppointments = await AppointmentServices.delete(appointmentId, decoded);
    await AvailabilityServices.revert(body);

    return res.status(200).send(myAppointments);
});

module.exports = routes;