import { App, Environments } from 'fyord';
import { defaultLayout } from './core/module';

import './styles/base.scss';

(async () => {
  const app = App.Instance(process.env.NODE_ENV || Environments.Production);
  await app.Start(defaultLayout);

  window['app'] = app;
})();

import './pages/module';
