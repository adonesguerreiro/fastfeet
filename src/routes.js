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

const routes = new Router();
const upload = multer(multerConfig);
// routes.post('/users', UserController.store);

routes.use(authMiddleware);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);
routes.post('/sessions', SessionController.store);
routes.post('/files', upload.single('file'), FileController.store);
routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);
routes.post('/order', OrderController.store);
routes.get('/order', OrderController.index);
// routes.put('/users', UserController.update);

export default routes;
