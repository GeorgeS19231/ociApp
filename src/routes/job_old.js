import express from 'express';
import { Job } from '../modules/job/job.schema.js';
import { auth } from '../middleware/auth.js';

export const jobRouter = express.Router();

// GET /jobs?city=london&status=open&title=nurse&q=javascript&sortBy=when.startDate&sortOrder=desc&page=1&limit=20
jobRouter.get('/jobs', auth, async (req, res) => {
    try {
        const { city, status, title, q, sortBy = 'when.startDate', sortOrder = 'asc', page = 1, limit = 20 } = req.query;

        const allowedSort = new Set(['when.startDate', 'createdAt']);
        const order = sortOrder === 'desc' ? -1 : 1;
        const safeSortBy = allowedSort.has(String(sortBy || '')) ? String(sortBy) : 'when.startDate';
        const safeLimit = Math.min(parseInt(limit) || 20, 50);
        const safePage = Math.max(parseInt(page) || 1, 1);

        const filter = {};
        if (city) filter.city = city.toLowerCase();
        if (status) filter.jobStatus = status;

        const sort = {};

        if (q) {
            // Text search: use $text operator
            filter.$text = { $search: q };
            sort.score = { $meta: 'textScore' };
        } else if (title) {
            // Exact/prefix match on title
            const escapedTitle = String(title).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.title = new RegExp(`^${escapedTitle}`, 'i');
            sort[safeSortBy] = order;
        } else {
            // Normal case: no search
            sort[safeSortBy] = order;
        }

        const query = Job.find(filter)
            .sort(sort)
            .skip((safePage - 1) * safeLimit)
            .limit(safeLimit);

        // Include score field only when doing text search
        if (q) {
            query.select({ score: { $meta: 'textScore' } });
        }

        const items = await query.lean();

        res.send({
            items,
            page: safePage,
            limit: safeLimit,
            hasMore: items.length === safeLimit
        });

    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})