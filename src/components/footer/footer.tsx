import { Component, ParseJsx } from 'fyord';
import { Icons } from '../../icons';
import { Navlinks } from '../../navLinks';
import styles from './footer.module.scss';

export class Footer extends Component {
  Template = async () => <footer class={styles.footer}>
    <div>
      {Icons.FyordLetter}
      <ul>
        {Navlinks.map(l => <li><a href={l.href}>{l.label}</a></li>)}
      </ul>
    </div>
    <div>
      <a href="https://github.com/Fyord/fyord" target="_blank" title="Fork Fyord on GitHub!">
        {Icons.Github}
      </a>
    </div>
  </footer>;
}
