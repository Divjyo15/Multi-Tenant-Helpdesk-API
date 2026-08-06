const redisClient = require('../config/redis');

const rateLimiter = async (req, res, next) => {
    try{
        const userId = req.user.userId;
    console.log('Rate limiter checking for user:', userId);
        const currentCount = await redisClient.incr(userId);
        console.log('Current count:', currentCount);
        if(currentCount === 1){
            await redisClient.expire(userId, 60);
        }
        if(currentCount >5) {
            return res.status(429).json({ message: 'Too many requests. Please try again later.' });
        }
        next();
    } catch (error) {
        console.error('Error in rate limiter:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = rateLimiter;