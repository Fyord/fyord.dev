import { DocsDetail } from './docsDetail/docsDetail';
import { NotFound } from './notFound/notFound';
import { Docs } from './docs/docs';
import { HomePage } from './home/home';

export const pages = [
  new DocsDetail(),
  new Docs(),
  new HomePage(),
  new NotFound()
];
