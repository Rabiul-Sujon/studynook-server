const Room = require('../models/Room');

// Get All Rooms (with search & filter)
const getAllRooms = async (req, res) => {
    try {
        const { search, amenities, minRate, maxRate } = req.query;

        let query = {};

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Filter by amenities
        if (amenities) {
            const amenitiesArray = amenities.split(',');
            query.amenities = { $in: amenitiesArray };
        }

        // Filter by hourly rate range
        if (minRate || maxRate) {
            query.hourlyRate = {};
            if (minRate) query.hourlyRate.$gte = Number(minRate);
            if (maxRate) query.hourlyRate.$lte = Number(maxRate);
        }

        const rooms = await Room.find(query).sort({ createdAt: -1 });
        res.status(200).json(rooms);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Latest 6 Rooms (for homepage)
const getLatestRooms = async (req, res) => {
    try {
        const rooms = await Room.find()
            .sort({ createdAt: -1 })
            .limit(6);
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Room
const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Room
const addRoom = async (req, res) => {
    try {
        const { 
            name, description, image, 
            floor, capacity, hourlyRate, amenities 
        } = req.body;

        const room = await Room.create({
            name,
            description,
            image,
            floor,
            capacity,
            hourlyRate,
            amenities,
            owner: req.user.id,
            ownerEmail: req.user.email
        });

        res.status(201).json({ 
            message: 'Room added successfully!', 
            room 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Room (Owner only)
const updateRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        // Check ownership
        if (room.owner.toString() !== req.user.id) {
            return res.status(403).json({ 
                message: 'Unauthorized. You can only update your own rooms.' 
            });
        }

        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({ 
            message: 'Room updated successfully!', 
            room: updatedRoom 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Room (Owner only)
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        // Check ownership
        if (room.owner.toString() !== req.user.id) {
            return res.status(403).json({ 
                message: 'Unauthorized. You can only delete your own rooms.' 
            });
        }

        await Room.findByIdAndDelete(req.params.id);

        res.status(200).json({ 
            message: 'Room deleted successfully!' 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get My Listings (Owner's rooms)
const getMyListings = async (req, res) => {
    try {
        const rooms = await Room.find({ owner: req.user.id })
            .sort({ createdAt: -1 });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getAllRooms, 
    getLatestRooms, 
    getRoomById, 
    addRoom, 
    updateRoom, 
    deleteRoom,
    getMyListings
};