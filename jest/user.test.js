/// ответ должен иметь статус-код 200
/// в ответе должен возвращаться токен
/// в ответе должен возвращаться объект user с 2 полями email и subscription, имеющие тип данных String
// describe('Registration Controller', () => {
//   let req;
//   let res;
//   let next;
//   let createUserMock;
//   let findUserByEmailMock;

//   beforeEach(() => {
//     req = {
//       body: {
//         email: 'test@example.com',
//         password: 'password123'
//       }
//     };
//     res = {
//       status: jest.fn(() => res),
//       json: jest.fn(() => res)
//     };
//     next = jest.fn();
//     createUserMock = jest.fn(() => ({ email: req.body.email }));
//     findUserByEmailMock = jest.fn(() => null);
//     jest.mock('../models/user', () => ({
//       findUserByEmail: findUserByEmailMock,
//       createUser: createUserMock
//     }));
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('Should return status code 200 for successful registration', async () => {
//     await registrationController(req, res, next);
//     expect(res.status).toHaveBeenCalledWith(200);
//   });

//   test('Should return the email in the response for successful registration', async () => {
//     await registrationController(req, res, next);
//     expect(res.json).toHaveBeenCalledWith({ user: req.body.email });
//   });

//   test('Should return status code 409 if email already in use', async () => {
//     findUserByEmailMock.mockReturnValueOnce({});
//     await registrationController(req, res, next);
//     expect(res.status).toHaveBeenCalledWith(409);
//   });

//   test('Should return error message if email already in use', async () => {
//     findUserByEmailMock.mockReturnValueOnce({});
//     await registrationController(req, res, next);
//     expect(res.json).toHaveBeenCalledWith({ message: 'Email is in use' });
//   });
// });
//
// В этом примере мы используем beforeEachblock для имитации функций findUserByEmailи createUser, а также для настройки основных reqи resобъектов, которые нужны контроллеру. В первом тестовом примере мы проверяем, что успешная регистрация возвращает код состояния 201. Во втором тестовом примере мы проверяем, что успешная регистрация возвращает электронное письмо в ответ. В третьем тестовом примере мы проверяем, что, если электронная почта уже используется, код состояния равен 409. В четвертом тестовом примере мы проверяем, что если электронная почта уже используется, возвращается сообщение об ошибке. Пожалуйста, дайте мне знать, если у вас есть другие вопросы.
