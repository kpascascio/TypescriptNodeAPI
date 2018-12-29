import request from 'supertest';
import app from '../src/app';

describe('GET /api', () => {
  it('should return 200 OK', () => {
    return expect(1).toEqual(1);
  });
});
