import { ParseJsx, Page, Route } from 'fyord';
import { Snippets } from '../../snippets';
import { SnippetComponent } from '../../components/module';
import { StyleName } from './styleName';
import { Icons } from '../../icons';
import { Navlinks } from '../../navLinks';
import styles from './home.module.scss';

export class HomePage extends Page {
  Route = (route: Route) => route.path === '/';
  Template = async () => {
    return <div class={styles[StyleName.Home]}>
      <header class={styles[StyleName.Header]}>
        <div class={styles[StyleName.HeaderLogo]}>{Icons.FyordCircle}</div>
        <h1>Fyord</h1>
        <p class={styles[StyleName.HeaderSlogan]}>A Minimalist UI Framework</p>
        <p class={styles[StyleName.HeaderSubtitle]}>Designed to embrace core competencies</p>
        <ul class={styles[StyleName.HeaderNav]}>
          {Navlinks.map(l => <li><a href={l.href}>{l.label}</a></li>)}
        </ul>
      </header>

      <div class={styles[StyleName.SectionWrapper]}>
        <section class={styles[StyleName.Section]}>
          <header>
            <h2>Components</h2>
            <p>Fyord allows you to build your UI using components that contain their own state, styles, and behaviors.
              Simply extend from the base Component class and import where you need them.</p>
          </header>
          {await new SnippetComponent(Snippets.Component).Render()}
        </section>

        <section class={styles[StyleName.Section]}>
          <header>
            <h2>Routing</h2>
            <p>Routing in Fyord is seamless. Simply use normal anchor tags! Local urls (which are not target=_blank) will be routed on the client.
              See the documentation to see examples of routing parameters.</p>
          </header>
          {await new SnippetComponent(Snippets.Routing).Render()}
        </section>

        <section class={styles[StyleName.Section]}>
          <header>
            <h2>Styling</h2>
            <p>Styling components in Fyord is straightforward, whether you want global or component level styles.</p>
            <p>Simply create a file with the .module.css and import to use! Prefer Sass instead? No problem, just change the extension to .scss.</p>
          </header>
          {await new SnippetComponent(Snippets.Styling).Render()}
        </section>

        <section class={styles[StyleName.Section]}>
          <header>
            <h2>State</h2>
            <p>Maintaining app and component state couldn’t be easier. Using decorators, you can quickly create state at the global app store or the
              local component level that will automatically update your component UI upon state change.</p>
          </header>
          {await new SnippetComponent(Snippets.State).Render()}
        </section>

        <section class={styles[StyleName.SectionMore]}>
          <header>
            <h2>And more...</h2>
          </header>
          <div class={styles[StyleName.SectionMoreItemWrapper]}>
            <div>
              {Icons.Code}
              <h3>JSX Templates</h3>
              <p>Create component templates Intuitively using familiar JSX syntax! Use the syntax and attributes you already know
                (class, events, etc.)</p>
            </div>
            <div>
              {Icons.Test}
              <h3>Testability</h3>
              <p>Fyord is designed with testability in mind! Testing Fyord components is like testing any other class. There are no life
                cycles or DI containers to pay tribute to here!</p>
            </div>
            <div>
              {Icons.PreRender}
              <h3>Pre-rendering</h3>
              <p>Fyord pages support three pre-render modes (static, dynamic, and hybrid), making optimizing for SEO or deploying a fully
                static site easy.</p>
            </div>
          </div>
        </section>
      </div>
    </div>;
  };
}
