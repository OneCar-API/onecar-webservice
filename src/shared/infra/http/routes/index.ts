import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import adsRouter from '@modules/adverts/infra/http/routes/ads.routes';
import confirmUsersRouter from '@modules/users/infra/http/routes/confirm.user.routes';
import addressesRouter from '@modules/addresses/infra/http/routes/addresses.routes';
import messagesRouter from '@modules/chat/infra/http/routes/messages.routes';

const routes = Router();

routes.use('/', usersRouter);
routes.use('/', addressesRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/user/confirm', confirmUsersRouter);
routes.use('/ads', adsRouter);
routes.use('/', messagesRouter);

export default routes;
