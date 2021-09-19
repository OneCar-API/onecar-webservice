import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import adsRouter from '@modules/advertises/infra/http/routes/ads.routes';

const routes = Router();

routes.use('/', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/ads', adsRouter);

export default routes;
