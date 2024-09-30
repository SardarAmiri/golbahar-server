const express = require("express");
const validateToken = require("../middlewares/validate-token");
const EventModel = require("../models/event.model");
const router = express.Router();

// create event

router.post("/create-event", validateToken, async (req, res) => {
  try {
    const event = await EventModel.create(req.body);
    return res
      .status(201)
      .json({ message: "Event Created Successfully", event });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// update event

router.put("/update-event/:id", validateToken, async (req, res) => {
  try {
    const event = await EventModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json({ message: "Event Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// delete event

router.delete("/delete-event/:id", validateToken, async (req, res) => {
  try {
    const event = await EventModel.findByIdAndDelete(req.params.id);
    return res.json({ message: "Event Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get event

router.get("/get-events", validateToken, async (req, res) => {
  try {
    const events = await EventModel.find().sort({ createdAt: -1 });
    return res.json({ data: events });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get event by id

router.get("/get-event/:id", validateToken, async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    return res.json({ data: event });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
