import request from 'supertest';
import app from '../config/app';

describe('#BodyParserMiddleware', () => {
  it('should parse body as json', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .post('/test-body-parser')
      .send({ name: 'Test' })
      .expect({ name: 'Test' });
  });
});
