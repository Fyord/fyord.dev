import { Page, ParseJsx, Route, Fragment, RawHtml } from 'fyord';
import { Header, SnippetComponent } from '../../components/module';
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
      {await new Header(this.Title, this.Description).Render()}

      {this.documentation &&
        <>
          <section>
            {this.documentation?.Snippet && await new SnippetComponent(this.documentation.Snippet).Render()}
          </section>

          {this.documentation.Children && await Promise.all(this.documentation.Children.map(async c => <section>
            <h2>{c.Name}</h2>
            <p><pre><code>{c.Type}</code></pre></p>
            <div>{await new RawHtml(c.Description).Render()}</div>


            {c.Snippet && <>
              <h3>Example:</h3>
              {await new SnippetComponent(c.Snippet).Render()}
            </>}
          </section>))}
        </>
      }
    </div>;
  }
}
