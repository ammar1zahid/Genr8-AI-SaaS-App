// Main server file: Sets up Express app, middleware, routes, and starts the server
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express()

// Connect to Cloudinary for image uploads
await connectCloudinary();

// Enable CORS for cross-origin requests
app.use(cors())
// Parse incoming JSON requests
app.use(express.json())


/* **** JSON Parse Error Handling  **** */
// app.use(express.json({
//   verify: (req, res, buf, encoding) => {
//     req.rawBody = buf.toString(encoding || 'utf8'); // capture raw body for debugging
//   }
// }));

// // Catch JSON parse errors
// app.use((err, req, res, next) => {
//   if (err && err.type === 'entity.parse.failed') {
//     console.error('❌ JSON parse error: ', err.message);
//     console.error('Raw body was:', req.rawBody);
//     return res.status(400).json({ success: false, error: 'Invalid JSON' });
//   }
//   next(err);
// });


// Clerk middleware for authentication
app.use(clerkMiddleware())

// Health check route
app.get('/', (req, res) => res.send('server is Live!'))


// Require authentication for all routes below
app.use(requireAuth())

// Mount AI feature routes under /api/ai
app.use('/api/ai', aiRouter)

// Mount user feature routes under /api/user
 app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})