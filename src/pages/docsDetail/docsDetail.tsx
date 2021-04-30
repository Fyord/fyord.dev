import { Page, ParseJsx, Route, Fragment, RawHtml } from 'fyord';
import { DocsNav, Header, SnippetComponent } from '../../components/module';
import { Docs, Documentation } from '../../docs';
import styles from './docsDetail.module.scss';

export class DocsDetail extends Page {
  private documentation: Documentation | undefined;

  Route = (route: Route) => {
    const docsName = route.routeParams?.[1];
    this.documentation = Docs.find(d => d.Name.toLowerCase() === docsName);

    if (this.documentation) {
      this.Title = this.documentation.Name;
      this.Description = this.documentation.Description;
    }

    return route.path.startsWith('/docs') && !!this.documentation;
  }

  Template = async () => {
    return <div class={styles.container}>
      {await new DocsNav().Render()}
      {await new Header(this.Title, this.Description).Render()}

      {this.documentation &&
        <>
          <section>
            {this.documentation.CliCommand && await new SnippetComponent(this.documentation.CliCommand).Render()}
          </section>

          {this.documentation.Children && await Promise.all(this.documentation.Children.map(async c => <section class={styles.childSection}>
            <div class={`${styles.body} ${c.Snippet ? '' : styles.fullWidth}`}>
              <h2 id={c.Name}>{c.Name}</h2>
              {c.Type && <p><pre><code>{c.Type}</code></pre></p>}
              <div>{await new RawHtml(c.Description).Render()}</div>
            </div>

            {c.Snippet && <div class={styles.example}>
              {await new SnippetComponent(c.Snippet).Render()}
            </div>}
          </section>))}
        </>
      }
    </div>;
  }
}
