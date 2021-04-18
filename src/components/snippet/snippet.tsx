import { Component, ParseJsx, State } from 'fyord';
import { CopyStringToClipboard } from '../../utility/copyStringToClipboard';
import { Icons } from '../../icons';
import styles from './snippet.module.scss';

const enum StyleNames {
  Editor = 'editor',
  EditorButtons = 'editor__buttons',
  EditorButtonsWindow = 'editor__buttons--window',
  EditorButton = 'editor__button',
  EditorButtonClose = 'editor__button--close',
  EditorButtonMinimize = 'editor__button--minimize',
  EditorButtonExpand = 'editor__button--expand',
  EditorButtonCopy = 'editor__button--copy',
}

export class SnippetComponent extends Component {
  @State private copyButtonContent = Icons.Copy;

  constructor(private code: string) {
    super();
  }

  Html = async () => {
    return <div class={styles.editor}>
      <div class={styles[StyleNames.EditorButtons]}>
        <div class={styles[StyleNames.EditorButtonsWindow]}>
          <div class={`${styles[StyleNames.EditorButton]} ${styles[StyleNames.EditorButtonClose]}`}></div>
          <div class={`${styles[StyleNames.EditorButton]} ${styles[StyleNames.EditorButtonMinimize]}`}></div>
          <div class={`${styles[StyleNames.EditorButton]} ${styles[StyleNames.EditorButtonExpand]}`}></div>
        </div>
        <button class={styles[StyleNames.EditorButtonCopy]} onclick={this.onCopyButtonClicked}>{this.copyButtonContent}</button>
      </div>
      <pre>{this.code}</pre>
    </div>;
  }

  private onCopyButtonClicked = () => {
    CopyStringToClipboard(this.code);
    this.copyButtonContent = <span>Snippet copied!</span>;

    setTimeout(() => {
      this.copyButtonContent = Icons.Copy;
    }, 1000);
  };
}
