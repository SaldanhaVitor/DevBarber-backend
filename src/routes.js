const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');
const Post = require('./models/Post');
const Availability = require('./models/Availability');
const Appointment = require('./models/Appointment');

const jwt = require('jsonwebtoken');

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
    const { userId, available } = req.body;
    const barberAvailable = await Availability.create({
        userId,
        available
    });
    return res.status(201).send(barberAvailable);
});

routes.get('/availability/:barberId', async (req, res) => {
    const { barberId } = req.params;
    const barberAvailable = await Availability.find({ barberId });
    if (barberAvailable.length > 0) {
        return res.status(200).send(...barberAvailable);
    }
    return res.status(404).send({ message: `No availability for barber ${barberId}` });
});

routes.post('/decode', async (req, res) => {
    const { token } = req.body;
    const decoded = jwt.decode(token, { complete: true });
    return res.status(200).send(decoded);
});

routes.post('/appointment/:token', async (req, res) => {
    const { token } = req.params;
    const { body } = req;
    const decoded = jwt.decode(token, { complete: true });
    body.user = decoded.payload.sub;
    const appoitment = await Appointment.create(body);
    return res.status(200).send(appoitment);
});

routes.get('/appointments/:token', async (req, res) => {
    const { token } = req.params;
    const decoded = jwt.decode(token, { complete: true });
    const user = decoded.payload.sub;
    const myAppointments = await Appointment.find({ user });
    if (myAppointments.lenght > 0)
        return res.status(200).send(myAppointments);
    return res.status(404).send({ message: 'No appointment found', user });
});

module.exports = routes;