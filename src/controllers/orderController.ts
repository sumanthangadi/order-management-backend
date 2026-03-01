import { Request, Response } from 'express';
import Order from '../models/Order';

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { customerName, mobileNumber, items, totalAmount } = req.body;

        const newOrder = new Order({
            customerName,
            mobileNumber,
            items,
            totalAmount,
        });

        const createdOrder = await newOrder.save();
        res.status(201).json(createdOrder);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { customerName, mobileNumber, items, totalAmount } = req.body;

        const order = await Order.findById(id);

        if (order) {
            order.customerName = customerName || order.customerName;
            order.mobileNumber = mobileNumber || order.mobileNumber;
            order.items = items || order.items;
            order.totalAmount = totalAmount || order.totalAmount;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (order) {
            await order.deleteOne();
            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
