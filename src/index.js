import dotenv from 'dotenv';
dotenv.config();

// Import express and cors
import express from 'express';
import cors from 'cors';

// Set up express
const app = express();
app.disable('x-powered-by');
//app.use(cors());
// CORS configuration
const corsOptions = {
    origin: 'https://welcomeabroad.netlify.app', // Replace with your Netlify site URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  };
  app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Import and use your routes
// server.js
import registerRouter from "./server/router/user.js";

app.use('/user', registerRouter);



// Catch-all route
app.get('*', (req, res) => {
    res.json({ ok: true });
});


// Start server
const port = process.env.PORT || 3030;
//const port = process.env.PORT;
app.listen(port, () => {
    console.log(`\n Server is running on http://localhost:${port}\n`);
});


