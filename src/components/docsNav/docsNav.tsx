import { Component, ParseJsx, Fragment, State } from 'fyord';
import { Strings } from 'tsbase/Functions/Strings';
import { Docs } from '../../docs';
import { Icons } from '../../icons';
import styles from './docsNav.module.scss';

export class DocsNav extends Component {
  @State private expanded = false;
  @State private expandedDocRoot = Strings.Empty;

  Template = async () => <nav class={`${styles.container} ${this.expanded ? styles.expanded : Strings.Empty}`}>
    <button class={styles.expandButton}
      onclick={() => this.expanded = !this.expanded}>{this.expanded ? Icons.ChevronLeft : Icons.ChevronRight}</button>
    <ul>
      <li>
        <a href="/docs">Getting Started</a>
      </li>
      {Docs.map(d => <li class={this.expandedDocRoot === d.Name ? styles.expanded : Strings.Empty}>
        {d.Children &&
          <button
            onclick={() => this.expandedDocRoot = this.expandedDocRoot !== d.Name ? d.Name : Strings.Empty}
          >{this.expandedDocRoot === d.Name ? Icons.ChevronUp : Icons.ChevronDown}</button>}

        <a onclick={() => this.expanded = false} href={`/docs/${d.Name.toLowerCase()}`}>{d.Name}</a>

        {d.Children && <>
          <ul>
            {d.Children.map(c => <li>
              <a onclick={() => this.expanded = false} href={`/docs/${d.Name.toLowerCase()}#${c.Name}`}>{c.Name}</a>
            </li>)}
          </ul>
        </>}
      </li>)}
    </ul>
  </nav>;
}
