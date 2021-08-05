import { App, Environments } from 'fyord';
import { defaultLayout } from './core/module';

import './styles/base.scss';

(async () => {
  const app = App.Instance(process.env.NODE_ENV || Environments.Production);
  await app.Start(defaultLayout);

  if (navigator.serviceWorker) {
    await navigator.serviceWorker.register(
      '/service-worker.js', { scope: '/' });
  }

  window['app'] = app;
})();

import './pages/module';
