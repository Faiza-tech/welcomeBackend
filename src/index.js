import dotenv from 'dotenv';
dotenv.config();

// Import express and cors
import express from 'express';
import cors from 'cors';

// Set up express
const app = express();
app.disable('x-powered-by');
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));




// server.js
import registerRouter from "./server/router/user.js";


app.use('/user', registerRouter);




app.get('*', (req, res) => {
    res.json({ ok: true });
});


const port = process.env.PORT;
app.listen(port, () => {
    console.log(`\n Server is running on http://localhost:${port}\n`);
});


