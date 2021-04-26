import { ParseJsx, Fragment } from 'fyord';
import { Footer } from '../components/footer/footer';

export const defaultLayout = async () =>
  <>
    <main></main>
    {await new Footer().Render()}
  </>;
