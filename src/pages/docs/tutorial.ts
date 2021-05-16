/* eslint-disable max-len */
import { Documentation } from './docsData';

export const tutorial: Documentation = {
  Name: 'Tutorial',
  Description: 'Build and deploy a blog with Fyord, Contentful, and Firebase',
  Children: [
    {
      Name: 'Scaffold App',
      Description: `<p>Let\'s get started by installing the fyord-cli and using it spin up a new project.</p>
<p>After running the following commands, checkout the running site at http://localhost:4200.</p>
<p>Then take a moment to read the README; it's short don't worry.</p>`,
      Snippet: `npm i -g fyord-cli
fyord new fyord-tutorial
cd fyord-tutorial
npm i
npm start`
    },
    {
      Name: 'Contentful Setup',
      Description: `<p>Now that our new Fyord app is up and running, Let's go ahead and take a moment to get a Contentful space ready for us when we need it. <em>You can skip this step if you don't want to hook into live data in this tutorial.</em></p>
<ol>
  <li>Head over to <a href="https://www.contentful.com/" target="_blank">contentful.com</a> and click "Get Started."</li>
  <li>Choose the "Start Building" option with the "Sign Up For Free" button. Not trying to pay money for anything here ;)</li>
  <li>Follow through the setup screens until you get to your home screen.</li>
  <li>Create a new <strong>empty</strong> space, and then delete any starter or example spaces the setup process may have added for you.</li>
  <li>Create an api key through <em>Settings > API keys</em>. We'll be using this key's <em>Space ID</em> and <em>Content Delivery API - access token</em> soon.</li>
  <li>
    <p>Create a content model called "Post" and give it these fields with the specified types:</p>
    <ul>
      <li>title | short text</li>
      <li>slug | short text</li>
      <li>description | short text</li>
      <li>body | rich text</li>
      <li>image | media</li>
      <li>date | date & time</li>
    </ul>
  </li>
  <li>Add at least one post for us to use, but the more the merrier.</li>
</ol>`
    },
    {
      Name: 'Scaffold Contentful Service',
      Description: `<p>Use the below command(s) to install the Contentful sdk and scaffold a new singleton service.</p>
<p>*The cli command assumes your terminal location is the root of your project. Adjust accordingly if this is not the case.</p>
<p>You could also scaffold this service anywhere you like, the below is just a convenience.</p>`,
      Snippet: `npm i contentful @contentful/rich-text-types
mkdir src/services && touch src/services/module.ts && cd src/services
fyord generate singleton contentful
      `
    },
    {
      Name: 'Add a Type to Represent Posts',
      Description: `<p>Soon we'll be pulling in posts from Contentful. Let's make working with that data easier by creating a type we can use.</p>
<p>Add the below as a file wherever you like (ex. src/contentTypes/iPost.ts):</p>`,
      Snippet: `import { Document } from '@contentful/rich-text-types';
import { Asset } from 'contentful';

export interface IPost {
  title: string;
  description: string;
  slug: string;
  date: string;
  body: Document;
  image?: Asset;
}`
    },
    {
      Name: 'Implement Contentful Service',
      Description: `<p>In this step we'll wire up the service we created to make use of the sdk we installed.</p>
<p>If you skipped the contentful step earlier, consider implementing a similar service that returns some dummy data in the same shape as the <em>Post</em> we'll be describing.</p>
<p>Update the <em>src/services/contentful/contentful.ts</em> with the below snippet.</p>
<p>*Note that you will need to replaces the "SPACE_ID" and "ACCESS_TOKEN" placeholders with the values from the api key you created earlier.</p>`,
      Snippet: `import * as sdk from 'contentful';

export interface IContentful {
  GetEntries<T>(query: Record<string, string>): Promise<sdk.EntryCollection<T>>;
}

export class Contentful implements IContentful {
  private static instance: IContentful | null = null;
  public static Instance(): IContentful { return this.instance || (this.instance = new Contentful()); }
  public static Destroy = () => Contentful.instance = null;

  public client: sdk.ContentfulClientApi;
  private entryCache = new Map<string, sdk.EntryCollection<any>>();

  private constructor() {
    this.client = sdk.createClient({
      space: 'SPACE_ID',
      accessToken: 'ACCESS_TOKEN'
    });
  }

  public async GetEntries<T>(query: Record<string, string>): Promise<sdk.EntryCollection<T>> {
    const cachedEntries = this.entryCache.get(JSON.stringify(query));

    if (cachedEntries) {
      return cachedEntries;
    } else {
      const entries = await this.client.getEntries<T>(query);
      this.entryCache.set(JSON.stringify(query), entries);
      return entries;
    }
  }
}
`
    },
    {
      Name: 'Update Content Security Policy (CSP)',
      Description: `<p>The <em>src/index.html</em> contains a CSP which will block content from unapproved sources.</p>
<p>It's a great security practice to use a CSP, and newly scaffolded Fyord projects include them. Learn more about them <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" target="_blank">here</a>.</p>
<p>Update the line starting with "connect-src" in your <em>index.html</em> with the following, replacing "SPACE_ID" with your space id:</p>`,
      Snippet: 'connect-src \'self\' https://cdn.contentful.com/spaces/SPACE_ID/;'
    },
    {
      Name: 'Scaffold the Home/List page',
      Description: `<p>We're going to need a homepage that lists out our posts.</p>
<p>Let's delete the existing welcome page and use the cli to scaffold a new page for us.</p>
<p><em>*commands assume you are in the project root</em></p>`,
      Snippet: `rm -rf src/pages/welcome
cd src/pages
fyord generate page home
`
    },
    {
      Name: 'Update the Home/List page',
      Description: `<p>Now, we're going to want to update the title, route, and template of the new page.</p>
<p>Update the contents of <code>home.tsx</code> with the following to accomplish this:</p>`,
      Snippet: `import { Page, ParseJsx, Route } from 'fyord';
import { PostCard } from '../../components/module';
import { IPost } from '../../core/contentTypes/iPost';
import { Contentful } from '../../core/services/module';
import styles from './home.module.css';

export class Home extends Page {
  Title = 'Home';
  Route = async (route: Route) => route.path === '/';

  Template = async () => {
    const entries = await Contentful.Instance().GetEntries<IPost>({
      content_type: 'post'
    });

    return <div class={styles.container}>
      <h1>My Fyord Blog</h1>

      <ul>
        {await Promise.all(entries.items.map(async e => <li>
          {await new PostCard(e.fields).Render()}
        </li>))}
      </ul>
    </div>;
  }
}`
    }
  ]
};
