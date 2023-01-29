/// ответ должен иметь статус-код 200
/// в ответе должен возвращаться токен
/// в ответе должен возвращаться объект user с 2 полями email и subscription, имеющие тип данных String
// const request = require('supertest');
// const app = require('../app');
// const router = require('../routes/api/auth');
// app.use('/api/auth', router);
// jest.setTimeout(15000);

// describe('test registrationController', () => {

//   test('Should return status code 200 for successful registration', async () => {
//     const response = await request(app).post('/api/auth/signup').send({
//       email: 'email@gmail.com',
//       password: 'password',
//     });

//     console.log(response.error);

//     expect(response.status).toBe(200);
//   });
// });
