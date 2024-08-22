
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const prisma = new PrismaClient();
const secret = process.env.secret; // Ensure this matches the environment variable name

// User registration function
const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const createdUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Respond with created user
    res.status(201).json({ data: createdUser });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// User login function
const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find user
    const foundUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!foundUser) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const passwordsMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordsMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT token
    const payload = { sub: foundUser.id };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // Add token expiry

    // Respond with token and user details
    res.json({ token, id: foundUser.id, userName: foundUser.username });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { signUp, logIn };
