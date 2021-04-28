import { Component, JsxRenderer, ParseJsx, Fragment } from 'fyord';
import { Strings } from 'tsbase/Functions/Strings';
import { Docs } from '../../docs';
import { Icons } from '../../icons';
import styles from './docsNav.module.scss';

const containerKey = 'container';
const toggleButtonKey = 'toggleButton';
const docRootListItemKey = 'docRootListItem';
const docRootToggleButtonKey = 'docRootToggleButton';

export class DocsNav extends Component {
  private expanded = false;

  Template = async () => <nav id={this.Ids(containerKey)} class={`${styles.container} ${this.expanded ? styles.expanded : Strings.Empty}`}>
    <button class={styles.expandButton} id={this.Ids(toggleButtonKey)} onclick={this.onNavToggleButtonClicked}>{Icons.ChevronRight}</button>
    <ul>
      <li>
        <a href="/docs">Getting Started</a>
      </li>
      {Docs.map((d, i) => <li id={this.Ids(`${docRootListItemKey}-${i}`)}>
        {d.Children &&
          <button id={this.Ids(`${docRootToggleButtonKey}-${i}`)}
            onclick={() => this.onDocRootToggleButtonClick(i)}>{Icons.ChevronDown}</button>}

        <a onclick={this.onNavToggleButtonClicked} href={`/docs/${d.Name.toLowerCase()}`}>{d.Name}</a>

        {d.Children && <>
          <ul>
            {d.Children.map(c => <li>
              <a onclick={this.onNavToggleButtonClicked} href={`/docs/${d.Name.toLowerCase()}#${c.Name}`}>{c.Name}</a>
            </li>)}
          </ul>
        </>}
      </li>)}
    </ul>
  </nav>;

  private onDocRootToggleButtonClick = (index: number) => {
    const listItem = this.windowDocument.getElementById(this.Ids(`${docRootListItemKey}-${index}`));
    const toggleButton = this.windowDocument.getElementById(this.Ids(`${docRootToggleButtonKey}-${index}`));
    const isExpanded = listItem?.classList.contains(styles.expanded);

    if (listItem && toggleButton) {

      if (isExpanded) {
        listItem.classList.remove(styles.expanded);
        toggleButton.innerHTML = JsxRenderer.RenderJsx(Icons.ChevronDown);

      } else {
        listItem.classList.add(styles.expanded);
        toggleButton.innerHTML = JsxRenderer.RenderJsx(Icons.ChevronUp);
      }
    }
  }

  private onNavToggleButtonClicked = (): void => {
    const toggleButton = this.windowDocument.getElementById(this.Ids(toggleButtonKey));
    const container = this.windowDocument.getElementById(this.Ids(containerKey));

    if (toggleButton && container) {
      this.expanded ?
        container.classList.remove(styles.expanded) :
        container.classList.add(styles.expanded);

      this.expanded = !this.expanded;
      toggleButton.innerHTML = JsxRenderer.RenderJsx(this.expanded ? Icons.ChevronLeft : Icons.ChevronRight);
    }
  }
}
