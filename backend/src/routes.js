import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import TourController from './app/controllers/TourController';
import SubscriptionController from './app/controllers/SubscriptionController';
import OrganizerController from './app/controllers/OrganizerController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/tours', TourController.index);
routes.post('/tours', TourController.store);
routes.put('/tours/:id', TourController.update);
routes.delete('/tours/:id', TourController.delete);
routes.post('/tours/:id/subscriptions', SubscriptionController.store);

routes.get('/subscriptions', SubscriptionController.index);
routes.delete('/subscriptions/:id', SubscriptionController.delete);

routes.get('/organizers', OrganizerController.index);
routes.get('/organizers/:id', OrganizerController.show);

routes.post('/upload', upload.single('file'), FileController.store);

export default routes;
