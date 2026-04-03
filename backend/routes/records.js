const express = require('express');
const router = express.Router();
const FinancialRecord = require('../models/FinancialRecord');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// @desc    Get all financial records (with filtering)
// @route   GET /api/records
// @access  Private (Viewer, Analyst, Admin)
router.get('/', protect, async (req, res, next) => {
    const { type, category, dateFrom, dateTo } = req.query;
    let query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) query.date.$gte = new Date(dateFrom);
        if (dateTo) query.date.$lte = new Date(dateTo);
    }

    try {
        const records = await FinancialRecord.find(query).sort({ date: -1 });
        res.json(records);
    } catch (error) {
        next(error);
    }
});

// @desc    Create a new financial record
// @route   POST /api/records
// @access  Private/Admin
router.post('/', protect, authorize(['Admin']), async (req, res, next) => {
    const { amount, type, category, date, notes } = req.body;

    // Explicit Validation
    if (typeof amount !== 'number' || amount <= 0) {
        res.status(400);
        return next(new Error('A valid positive number is required for amount'));
    }

    if (!['income', 'expense'].includes(type)) {
        res.status(400);
        return next(new Error('Transaction type must be either income or expense'));
    }

    if (!category || category.trim() === '') {
        res.status(400);
        return next(new Error('Category is a required field'));
    }

    try {
        const record = await FinancialRecord.create({
            amount,
            type,
            category,
            date: date || new Date(),
            notes,
            createdBy: req.user._id,
        });

        res.status(201).json(record);
    } catch (error) {
        next(error);
    }
});

// @desc    Update a financial record
// @route   PUT /api/records/:id
// @access  Private/Admin
router.put('/:id', protect, authorize(['Admin']), async (req, res, next) => {
    const { amount, type, category, date, notes } = req.body;

    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
        res.status(400);
        return next(new Error('Amount must be a positive number if provided'));
    }

    try {
        const record = await FinancialRecord.findById(req.params.id);

        if (!record) {
            res.status(404);
            return next(new Error('Financial record not found'));
        }

        record.amount = amount ?? record.amount;
        record.type = type || record.type;
        record.category = category || record.category;
        record.date = date || record.date;
        record.notes = notes || record.notes;

        const updatedRecord = await record.save();
        res.json(updatedRecord);
    } catch (error) {
        next(error);
    }
});

// @desc    Delete a financial record
// @route   DELETE /api/records/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize(['Admin']), async (req, res, next) => {
    try {
        const record = await FinancialRecord.findById(req.params.id);

        if (!record) {
            res.status(404);
            return next(new Error('Financial record not found'));
        }

        await FinancialRecord.findByIdAndDelete(req.params.id);
        res.json({ message: 'Record removed successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
