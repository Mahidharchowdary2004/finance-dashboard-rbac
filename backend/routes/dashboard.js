const express = require('express');
const router = express.Router();
const FinancialRecord = require('../models/FinancialRecord');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get dashboard summary
// @route   GET /api/dashboard
// @access  Private (Viewer, Analyst, Admin)
router.get('/', protect, async (req, res) => {
    try {
        const records = await FinancialRecord.find({});
        
        let totalIncome = 0;
        let totalExpenses = 0;
        let categoryBreakdown = {};
        
        // Monthly Trends Aggregation
        let trendsMap = {}; // { '2024-01': { income: 0, expense: 0, name: 'Jan 2024' } }
        
        records.forEach(record => {
            const date = new Date(record.date);
            const monthIdx = date.getMonth();
            const year = date.getFullYear();
            const yearMonth = `${year}-${String(monthIdx + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleString('default', { month: 'short' });
            
            if (!trendsMap[yearMonth]) {
                trendsMap[yearMonth] = { income: 0, expense: 0, name: `${monthName} ${year}` };
            }

            if (record.type === 'income') {
                totalIncome += record.amount;
                trendsMap[yearMonth].income += record.amount;
            } else {
                totalExpenses += record.amount;
                trendsMap[yearMonth].expense += record.amount;
            }
            
            if (categoryBreakdown[record.category]) {
                categoryBreakdown[record.category] += record.amount;
            } else {
                categoryBreakdown[record.category] = record.amount;
            }
        });

        // Convert Map to Sorted Array
        const monthlyTrends = Object.keys(trendsMap)
            .sort() // Sort by YYYY-MM
            .map(key => ({
                month: trendsMap[key].name,
                income: trendsMap[key].income,
                expense: trendsMap[key].expense
            }));
        
        const recentTransactions = await FinancialRecord.find({}).sort({ date: -1 }).limit(10);
        
        res.json({
            totalIncome,
            totalExpenses,
            netBalance: totalIncome - totalExpenses,
            categoryBreakdown,
            monthlyTrends,
            recentTransactions,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
