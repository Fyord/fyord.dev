import { App, ISeoService, Page, ParseJsx, Fragment, Route, State, RawHtml } from 'fyord';
import { Queryable } from 'tsbase/Collections/Queryable';
import { Strings } from 'tsbase/Functions/Strings';
import { Header } from '../../components/header/header';
import { SnippetComponent } from '../../components/module';
import { Docs as docsData, Documentation } from '../../docs';
import styles from './docs.module.scss';

const searchTermParamKey = 'search';
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

  // eslint-disable-next-line complexity
  Template = async (route?: Route) => {
    if (!this.searchTerm && route?.queryParams.has(searchTermParamKey)) {
      this.searchTerm = route.queryParams.get(searchTermParamKey) as string;
    }

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
                <p>{searchResults.length} result{searchResults.length > 1 ? 's' : Strings.Empty} found</p>
                <ul class={styles.resultList}>
                  {await Promise.all(searchResults.map(async r =>
                    <li>
                      <a href={`/docs/${r.Name.toLocaleLowerCase()}`}>
                        <h3>{r.Name}</h3>
                        {await new RawHtml(this.getRelevantDescription(r)).Render()}
                      </a>
                    </li>))}
                </ul>
              </> :
              <p>No results for "{this.searchTerm}" found.</p>}
          </> :
          <div class={styles.gettingStarted}>
            <h2>Getting Started</h2>
            <p>Scaffold a new Fyord app with our CLI and dive right in!</p>

            {await new SnippetComponent(quickStart).Render()}
          </div>
        }
      </section>
    </div>;
  }

  private getRelevantDescription(documentation: Documentation): string {
    const stringifiedDocumentation = JSON.stringify(documentation).replace(/[^a-zA-Z0-9 ]/g, Strings.Empty);

    if (stringifiedDocumentation.includes(this.searchTerm)) {
      return `<p>...<b>${this.searchTerm}</b>${stringifiedDocumentation.split(this.searchTerm)[1].slice(0, 50)}...</p>`;
    } else {
      return `<p>${documentation.Description}</p>`;
    }
  }
}
