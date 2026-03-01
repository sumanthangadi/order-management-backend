import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalRevenueMatch = await Order.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = totalRevenueMatch.length > 0 ? totalRevenueMatch[0].total : 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayRevenueMatch = await Order.aggregate([
            { $match: { status: 'delivered', createdAt: { $gte: today } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const todayRevenue = todayRevenueMatch.length > 0 ? todayRevenueMatch[0].total : 0;

        const monthlyRevenueMatch = await Order.aggregate([
            {
                $match: {
                    status: 'delivered',
                    createdAt: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const monthlyRevenue = monthlyRevenueMatch.length > 0 ? monthlyRevenueMatch[0].total : 0;

        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const readyOrders = await Order.countDocuments({ status: 'ready' });
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

        // Last 7 days revenue
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const dailyRevenueLast7Days = await Order.aggregate([
            { $match: { status: 'delivered', createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: '$totalAmount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top selling items
        const topItems = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.name',
                    totalQuantity: { $sum: '$items.quantity' }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            totalRevenue,
            todayRevenue,
            monthlyRevenue,
            totalOrders,
            pendingOrders,
            readyOrders,
            deliveredOrders,
            dailyRevenueLast7Days,
            topItems
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
