// Import express and cors
import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

// Set up express
const app = express();
app.disable('x-powered-by');
//app.use(cors());
// CORS configuration
const corsOptions = {
   //origin: 'https://welcomeabroad.netlify.app', // Replace with your Netlify site URL
   origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes // Import and use your routes
// server.js
import registerRouter from "./server/router/user.js";
app.use('/user', registerRouter);

// Catch-all route
app.get('*', (req, res) => {
    res.json({ ok: true });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`\n Server is running on http://localhost:${port}\n`);
});
