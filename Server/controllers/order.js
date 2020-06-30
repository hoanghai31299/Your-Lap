const Order = require('../models/orders');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const orderDelete = await Order.findOne({_id: id}).lean();
        if (!orderDelete) {
            return next(new Error('Order_NOT_FOUND'));
        }
        await Order.updateOne({ _id: id }, {data: {$set: { deleteAt: new Date() }}} );
        return res.status(200).json({
            message : 'delete order successful',
        });
    } catch (e) {
        next(e);
    }
};

const getOrder = async (req, res, next) => {
    try {
        const {id} = req.params;
        const order = await Order.findOne({_id: id, deleteAt: undefined}).lean().populate({
            path: 'user'
        });
        if(!order) return next(new Error('order_NOT_FOUND'));
        return res.status(200).json({
            message: 'Order',
            order
        })
    } catch (e) {
        next(e);
    }
}

const getAllOrder = async (req, res, next) => {
    try {
        let { page, limit, date, state } = req.query;
        if(!page) {
            page = 0;
        }
        else {
            page = parseInt(page)
        }
        if(!limit) {
            limit = 0;
        }
        else {
            limit = parseInt(limit);
        }
        let sort, skip;
        if(page) {
            skip = (page - 1) * limit;
        }
        if(date) {
            sort = {
                createdAt: date === "true"? 1 : -1,
            }
        }
        let listOrder;
        if(state) {
            listOrder = await Order.find({deleteAt: undefined, state: state}).lean().populate(
                {
                    path: 'user',
                    // select: 'fullname'
                }
            ).populate(
                {
                    path: 'promotion',
                    // select: 'name nation'
                }
            ).limit(limit).skip(skip);
        }
        else {
            listOrder = await Order.find({deleteAt: undefined}).lean().populate(
                {
                    path: 'user',
                    // select: 'fullname'
                }
            ).populate(
                {
                    path: 'promotion',
                    // select: 'name nation'
                }
            ).sort(sort).limit(limit).skip(skip);
        }
        return res.status(200).json({
            message: 'ListOrder',
            listOrder
        })
    } catch (e) {
        next(e)
    }
}
const createOrder = async (req, res, next) => {
    try {
        const data = req.body;
        const createdOrder = await Order.create(data);
        return res.status(200).json({
            message: "create Order successfully",
            createdOrder
        });
    } catch (e) {
        next(e);
    }
}

const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        _.omitBy(data, _.isNull);
        const existedOrder = await Order.findOne({ _id: id });
        if (!existedOrder) {
            return next(new Error('Order_NOT_FOUND'));
        }
        const updateInfo = { $set: data };
        const orderUpdate = await Order.findOneAndUpdate({_id: id, deleteAt: undefined }, updateInfo, {
            new: true
        }).lean();
        
        return res.status(200).json({
            message : 'update successful',
            data: orderUpdate,
            data_update: updateInfo
        });
        
    } catch (e) {
        return next(e);
    }
};

module.exports = {
    deleteOrder,
    getOrder,
    getAllOrder,
    updateOrder,
    createOrder
}