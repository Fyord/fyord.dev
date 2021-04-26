import { Page, ParseJsx, RenderModes, Route } from 'fyord';
import { Header } from '../../components/module';
import styles from './notFound.module.scss';

export class NotFound extends Page {
  Title = 'Not Found';
  RenderMode = RenderModes.Dynamic;
  Route = () => true;

  Template = async (route?: Route) =>
    <div class={styles.container}>
      {await new Header(this.Title, `Could not find content at, "${decodeURI(route?.path || '')}"`).Render()}

      <p class={styles.suggestion}>Please check your spelling. Otherwise the resource may have been moved.</p>
    </div>;
}
