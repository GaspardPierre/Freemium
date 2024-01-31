const CalendarEvent = require('../models/CalendarEvent');

exports.addEvent = async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;
    const newEvent = new CalendarEvent({ title, description, startTime, endTime });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find({});
    res.json(events);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
