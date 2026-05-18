const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

// Create Booking
const createBooking = async (req, res) => {
    try {
        const { roomId, date, startTime, endTime, totalCost, specialNote } = req.body;

        // Check for time conflict
        const conflict = await Booking.findOne({
            room: roomId,
            date: date,
            status: 'confirmed',
            $or: [
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime }
                }
            ]
        });

        if (conflict) {
            return res.status(400).json({ 
                message: 'This time slot is already booked. Please choose a different time.' 
            });
        }

        // Create booking
        const booking = await Booking.create({
            room: roomId,
            user: req.user.id,
            userEmail: req.user.email,
            date,
            startTime,
            endTime,
            totalCost,
            specialNote
        });

        // $push booking ID to user's bookings array
        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { bookings: booking._id } }
        );

        // Increment room's bookingCount
        await Room.findByIdAndUpdate(
            roomId,
            { $inc: { bookingCount: 1 } }
        );

        res.status(201).json({ 
            message: 'Room booked successfully!', 
            booking 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get My Bookings
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('room', 'name image hourlyRate floor')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel Booking
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        // Check ownership
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ 
                message: 'Unauthorized. You can only cancel your own bookings.' 
            });
        }

        // Update status to cancelled
        booking.status = 'cancelled';
        await booking.save();

        // $pull booking ID from user's bookings array
        await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { bookings: booking._id } }
        );

        // Decrement room's bookingCount
        await Room.findByIdAndUpdate(
            booking.room,
            { $inc: { bookingCount: -1 } }
        );

        res.status(200).json({ message: 'Booking cancelled successfully.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, cancelBooking };