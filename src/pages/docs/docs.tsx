import { Page, ParseJsx, Route } from 'fyord';
import { Header } from '../../components/header/header';
import { SnippetComponent } from '../../components/module';
import styles from './docs.module.scss';

const quickStart = `npx fyord-cli new NewFyordApp
cd NewFyordApp
npm i
npm start`;

export class Docs extends Page {
  Title = 'Docs';
  Route = (route: Route) => route.path === '/docs';

  Template = async () => {
    return <div class={styles.container}>
      {await new Header(this.Title, 'Official docs for the Fyord framework').Render()}

      <form>
        <input type="search" placeholder="Search the docs..." />
      </form>

      <section>
        <h2>Getting Started</h2>
        <p>Scaffold a new Fyord app with our CLI and dive right in!</p>

        {await new SnippetComponent(quickStart).Render()}
      </section>
    </div>;
  }
}
