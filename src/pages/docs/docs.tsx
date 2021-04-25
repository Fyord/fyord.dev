import { App, ISeoService, Page, ParseJsx, Route } from 'fyord';
import { Header } from '../../components/header/header';
import { SnippetComponent } from '../../components/module';
import styles from './docs.module.scss';

const searchInputIdKey = 'searchInput';
const quickStart = `npx fyord-cli new NewFyordApp
cd NewFyordApp
npm i
npm start`;

export class Docs extends Page {
  Title = 'Docs';
  Description = 'Official docs for the Fyord framework';
  Route = (route: Route) => route.path === '/docs';

  constructor(seoService?: ISeoService, app?: App, windowDocument?: Document) {
    super(seoService, app, windowDocument);

    setTimeout(() => {
      const searchInput = this.windowDocument.getElementById(this.Ids(searchInputIdKey)) as HTMLInputElement;
      searchInput.focus();
    });
  }

  Template = async () => {
    return <div class={styles.container}>
      {await new Header(this.Title, this.Description).Render()}

      <form>
        <input id={this.Ids(searchInputIdKey)} type="search" placeholder="Search the docs..." />
      </form>

      <section>
        <h2>Getting Started</h2>
        <p>Scaffold a new Fyord app with our CLI and dive right in!</p>

        {await new SnippetComponent(quickStart).Render()}
      </section>
    </div>;
  }
}
