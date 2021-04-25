import { App, ISeoService, Page, ParseJsx, Fragment, Route, State } from 'fyord';
import { Queryable } from 'tsbase/Collections/Queryable';
import { Strings } from 'tsbase/Functions/Strings';
import { Header } from '../../components/header/header';
import { SnippetComponent } from '../../components/module';
import { Docs as docsData } from '../../docs';
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

  @State private searchTerm = Strings.Empty;
  private get searchInput(): HTMLInputElement {
    return this.windowDocument.getElementById(this.Ids(searchInputIdKey)) as HTMLInputElement;
  }

  constructor(seoService?: ISeoService, app?: App, windowDocument?: Document) {
    super(seoService, app, windowDocument);
  }

  Template = async () => {
    const searchTermEntered = this.searchTerm.trim().length >= 3;
    const searchResults = searchTermEntered ? Queryable.From(docsData).Search(this.searchTerm, 3).ToArray() : [];

    setTimeout(() => {
      this.searchInput.value = Strings.Empty;
      this.searchInput.focus();
      this.searchInput.value = this.searchTerm;
    });

    return <div class={styles.container}>
      {await new Header(this.Title, this.Description).Render()}

      <form>
        <input id={this.Ids(searchInputIdKey)}
          type="search" placeholder="Search the docs..."
          value={this.searchTerm}
          oninput={() => this.searchTerm = this.searchInput.value} />
      </form>

      <section>
        {searchTermEntered ?
          <>
            {searchResults.length > 0 ?
              <>
                <p>{searchResults.length} results found</p>
                <ul>
                  {searchResults.map(r => <li>
                    <a href={`/docs/${r.Name.toLocaleLowerCase()}`}>
                      <p>{r.Name}</p>
                      <p>{r.Description}</p>
                    </a>
                  </li>)}
                </ul>
              </> :
              <p>No results for "{this.searchTerm}" found.</p>}
          </> :
          <>
            <h2>Getting Started</h2>
            <p>Scaffold a new Fyord app with our CLI and dive right in!</p>

            {await new SnippetComponent(quickStart).Render()}
          </>
        }
      </section>
    </div>;
  }
}
