import { App, Environments, Route } from 'fyord';
import { defaultLayout } from './core/module';

import './styles/base.scss';
import './pages/module';

function scrollToTopOrHash(route: Route | undefined) {
  const hashElementId = route?.hashParams[0];
  if (hashElementId) {
    const hashElement = document.getElementById(hashElementId);
    if (hashElement) {
      window.scrollTo(0, hashElement.offsetTop > 50 ? hashElement.offsetTop - 50 : hashElement.offsetTop);
    }

  } else {
    window.scroll(0, 0);
  }
}

(async () => {
  const app = App.Instance(process.env.NODE_ENV || Environments.Production);
  await app.Start(defaultLayout);

  app.Router.Route.Subscribe((route?: Route) => {
    setTimeout(() => {
      scrollToTopOrHash(route);
    });
  });

  window['app'] = app;
})();
