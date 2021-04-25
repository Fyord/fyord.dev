import { Component, ParseJsx } from 'fyord';
import { Icons } from '../../icons';
import styles from './header.module.scss';

export class Header extends Component {
  constructor(
    private heading: string,
    private description: string
  ) {
    super();
  }

  Template = async () => <header class={styles.container}>
    <div class={styles.iconWrapper}>{Icons.FyordCircle}</div>
    <h1>{this.heading}</h1>
    <p>{this.description}</p>
  </header>;
}
