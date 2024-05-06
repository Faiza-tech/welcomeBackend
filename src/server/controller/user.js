import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// Load our .env file
import dotenv from "dotenv";
dotenv.config();

// Use process.env to access JWT secret
const secret = process.env.secret;

const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
   // console.log("this is the body:",req.body)
    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = await prisma.user.create({
      data: {
       username,
        email,
        password: hashedPassword,
      },
    });
   // console.log("this is the created user:", createdUser);
    res.status(201).json({ data: createdUser });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
 if(!email || !password) {
  return res.status(401).json({error: "field missing"})
 }
  const foundUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!foundUser) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const passwordsMatch = await bcrypt.compare(password, foundUser.password);

  if (!passwordsMatch) {
    return res.status(401).json({ error: "Invalid email or password." });
  } else {
    const payload = { sub: foundUser.id };

    const createToken = (payload, secret) => {
      const token = jwt.sign(payload, secret);
      return token;
    };

    const token = createToken(payload, secret);
    res.json({ data: token , id: foundUser.id});

    //console.log(token);
  }
};

export { signUp, logIn };
