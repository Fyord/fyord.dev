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
    <a href="/" class={styles.iconWrapper}>{Icons.FyordCircle}</a>
    <h1>{this.heading}</h1>
    <p>{this.description}</p>
  </header>;
}
