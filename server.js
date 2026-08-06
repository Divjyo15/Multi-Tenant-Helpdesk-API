const express = require('express');
const dotenv =require('dotenv');
dotenv.config();
const ConnectDB = require('./config/db');
const redisClient = require('./config/redis');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const PORT = process.env.PORT || 3000; 
const app = express();

ConnectDB();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', ticketRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});