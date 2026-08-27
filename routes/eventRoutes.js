const express = require("express");
const router = express.Router();
const Event = require("../models/event");

// ==========================================
// CREATE - Add a new event
// POST /api/events
// ==========================================
router.post("/", async (req, res) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      message: "Event created successfully!",
      event: event
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating event",
      error: error.message
    });
  }
});

// ==========================================
// READ - Get all events
// GET /api/events
// ==========================================
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching events",
      error: error.message
    });
  }
});

// ==========================================
// READ - Get one event by ID
// GET /api/events/:id
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({
      message: "Invalid event ID",
      error: error.message
    });
  }
});

// ==========================================
// UPDATE - Update an event
// PUT /api/events/:id
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.status(200).json({
      message: "Event updated successfully!",
      event: updatedEvent
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating event",
      error: error.message
    });
  }
});

// ==========================================
// DELETE - Delete an event
// DELETE /api/events/:id
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.status(200).json({
      message: "Event deleted successfully!",
      event: deletedEvent
    });
  } catch (error) {
    res.status(400).json({
      message: "Error deleting event",
      error: error.message
    });
  }
});

module.exports = router;