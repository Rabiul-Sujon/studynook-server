 const express = require('express');
 const router = express.Router();

 const {
    getAllRooms,
    getLatestRooms,
    getRoomById,
    addRoom,
    updateRoom,
    deleteRoom,
    getMyListings
 } = require('../controllers/roomController');
 const authMiddleware = require('../middleware/authMiddleware');

 router.get('/', getAllRooms);
 router.get('/latest', getLatestRooms);
 router.get('/my-listings', authMiddleware, getMyListings);
 router.get('/:id', getRoomById);
 router.post('/', authMiddleware, addRoom);
 router.put('/:id', authMiddleware, updateRoom);
 router.delete('/:id', authMiddleware, deleteRoom);

 module.exports = router;