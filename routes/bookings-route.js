const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validate-token");
const BookingModel = require("../models/booking-model");
const EventModel = require("../models/event.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-booking", validateToken, async (req, res) => {
  try {
    req.body.user = req.user._id;

    const isFreeEvent = req.body.totalAmount === 0;

    const bookingPayload = {
      user: req.body.user,
      event: req.body.event,
      ticketType: req.body.ticketType,
      ticketsCount: req.body.ticketsCount,
      totalAmount: req.body.totalAmount,
      status: req.body.status,
      ...(isFreeEvent ? {} : { paymentId: req.body.paymentId }),
    };

    const booking = await BookingModel.create(bookingPayload);

    if (!isFreeEvent) {
      const event = await EventModel.findById(req.body.event);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const ticketTypes = event.ticketTypes;
      const updatedTicketTypes = ticketTypes.map((ticketType) => {
        if (ticketType.name === req.body.ticketType) {
          ticketType.booked =
            Number(ticketType.booked ?? 0) + Number(req.body.ticketsCount);
          ticketType.available =
            Number(ticketType.available ?? ticketType.limit) -
            Number(req.body.ticketsCount);
        }
        return ticketType;
      });

      await EventModel.findByIdAndUpdate(req.body.event, {
        ticketTypes: updatedTicketTypes,
      });
    }

    return res
      .status(201)
      .json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/get-user-bookings", validateToken, async (req, res) => {
  try {
    const bookings = await BookingModel.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });
    return res.status(200).json({ data: bookings });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/get-all-bookings", validateToken, async (req, res) => {
  try {
    const bookings = await BookingModel.find()
      .populate("event")
      .populate("user")
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: bookings });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/cancel-bookings", validateToken, async (req, res) => {
  try {
    const {
      eventId,
      paymentId,
      bookingId,
      ticketsCount,
      ticketTypeName,
      totalAmount,
    } = req.body;

    const isFreeEvent = totalAmount === 0;

    if (!isFreeEvent) {
      const refund = await stripe.refunds.create({ payment_intent: paymentId });

      if (refund.status !== "succeeded") {
        return res.status(400).json({
          message: "Refund failed",
        });
      }
    }

    await BookingModel.findByIdAndUpdate(bookingId, { status: "cancelled" });

    const event = await EventModel.findById(eventId);
    const ticketTypes = event.ticketTypes;

    const updatedTicketTypes = ticketTypes.map((ticketType) => {
      if (ticketType.name === ticketTypeName) {
        ticketType.booked =
          Number(ticketType.booked ?? 0) - Number(ticketsCount);
        ticketType.available =
          Number(ticketType.available ?? ticketType.limit) +
          Number(ticketsCount);
      }
      return ticketType;
    });

    await EventModel.findByIdAndUpdate(eventId, {
      ticketTypes: updatedTicketTypes,
    });

    return res.status(200).json({ message: "Booking Cancelled Successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error); // Log the error for debugging
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
