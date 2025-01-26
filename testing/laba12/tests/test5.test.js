import request from 'supertest';
import { expect } from 'chai';
import app from '../index.js';

describe('GET /posts', () => {
  it('should return a paginated list of posts', async () => {
    const page = 1;
    const limit = 5;

    const response = await request(app)
      .get(`/posts?page=${page}&limit=${limit}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).to.have.lengthOf(limit);
  });

  it('should return an empty array for a non-existing page', async () => {
    const page = 999; 
    const limit = 5;

    const response = await request(app)
      .get(`/posts?page=${page}&limit=${limit}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).to.deep.equal([]);
  });

  it('should return an error for invalid pagination parameters', async () => {
    const response = await request(app)
      .get('/posts?page=invalid&limit=invalid')
      .expect('Content-Type', /json/)
      .expect(400); 
  });
});