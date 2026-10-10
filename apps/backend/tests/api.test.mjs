import request from 'supertest';
import express from 'express';
import { describe, it, expect } from 'vitest';

// Import routes for testing
import authRoutes from '../src/routes/authRoutes.js';
import productRoutes from '../src/routes/productRoutes.js';

const app = express();
app.use(express.json());

// Mock health route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'PricePilot API is running' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

describe('API Health and Structure', () => {
  it('should return 200 on health endpoint', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('should fail auth route without token', async () => {
    const response = await request(app).get('/api/v1/auth/me');
    expect(response.status).toBe(401);
  });
});
