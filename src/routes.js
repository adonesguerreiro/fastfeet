import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import ProblemsController from './app/controllers/ProblemsController';

const routes = new Router();
const upload = multer(multerConfig);
// routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.get('/deliveryman/:id/deliveries', OrderController.show);
routes.post('/files', upload.single('file'), FileController.store);
// Rotas para administradores autenticados na aplicação
routes.use(authMiddleware);
// Routes from recipients
routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);
// Routes from deliverymans
routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);
// Routes from orders
routes.post('/order', OrderController.store);
routes.put('/order', OrderController.update);
routes.get('/order', OrderController.index);

// routes.put('/users', UserController.update);

// Routes from problems
routes.get('/problems', ProblemsController.index);
routes.get('/delivery/:id/problems', ProblemsController.show);
routes.post('delivery/:id/problems', ProblemsController.store);

export default routes;
