import express from 'express';
import { getOrders, createOrder, updateOrder, updateOrderStatus, deleteOrder } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(protect, getOrders)
    .post(protect, createOrder);

router.route('/:id')
    .put(protect, updateOrder)
    .delete(protect, deleteOrder);

router.route('/:id/status')
    .patch(protect, updateOrderStatus);

export default router;
