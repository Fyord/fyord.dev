/* eslint-disable max-lines */
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
<p>Let's delete the existing welcome page and use the cli to scaffold a new page for us.</p>`,
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
        {entries.items.map(e => <li>
          <a href={\`/posts/\${e.fields.slug}\`}>{e.fields.title} | {new Date(e.fields.date).toLocaleDateString()}</a>
        </li>)}
      </ul>
    </div>;
  }
}`
    },
    {
      Name: 'Add a post page',
      Description: `<p>Use the CLI to scaffold a new 'post' page.</p>
<p>This time we'll use the aliased version of the cli's generate command (g = generate, p = page).</p>`,
      Snippet: `cd src/pages
fyord g p post`
    },
    {
      Name: 'Implement the post page',
      Description: `<p>Now let's get this page displaying our post details.</p>
<p>This page's route function will be quite a bit different. Consider that this page will have a different title depending on the post data. Also consider how 404/not found functionality.</p>
<p>Route resolution is very flexible in the Fyord framework. We're not just talking pattern matching here. You'll notice in our implementation for this page's route, we determine if the pattern matches, but then also determine if we have the data to support rendering the page; if not, we let our 404 page catch it. This also allows us to intuitively set the dynamic page title based on the dynamic content.</p>
<p>Go ahead and update the <code>post.tsx</code> with the following:</p>`,
      Snippet: `import { Page, ParseJsx, RawHtml, Route } from 'fyord';
import { IPost } from '../../core/contentTypes/post';
import { Contentful } from '../../core/services/module';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import styles from './post.module.css';

export class Post extends Page {
  private post!: IPost;

  Route = async (route: Route) => {
    let routeMatch = false;

    if (route.path.startsWith('/posts/') && route.routeParams.length === 2) { /* check the pattern */
      const slug = route?.routeParams[1];
      const postsQueryResults = await Contentful.Instance().GetEntries<IPost>({
        content_type: 'post',
        'fields.slug': slug || ''
      });

      if (postsQueryResults.items.length >= 1) { /* check if we have the data */
        this.post = postsQueryResults.items[0].fields;
        this.Title = this.post.title;
        routeMatch = true;
      }
    }

    return routeMatch;
  };

  Template = async () => {
    return <div class={styles.container}>
      <article>
        <h1>{this.post.title}</h1>
        {this.post.image && <div class={styles.imageWrapper}>
          <img src={\`https:\${this.post.image.fields.file.url}\`} alt={this.post.image.fields.description} />
        </div>}
        <p>{new Date(this.post.date).toLocaleDateString()}</p>

        {await new RawHtml(documentToHtmlString(this.post.body)).Render()}
      </article>
    </div>;
  }
}`
    },
    {
      Name: 'Update the layout',
      Description: `<p>At this point, we've got functioning list and detail pages for our posts.</p>
<p>Let's take moment to update the layout with a header containing a home link and a basic footer.</p>
<p>One thing to note about Fyord routing, is that <strong>the</strong> <code>main</code> element is what is updated during routing, so you can think of it as your router "outlet."</p>
<p>Open <code>src/layout.tsx</code> and update it with the following:</p>`,
      Snippet: `import { Fragment, ParseJsx } from 'fyord';

export const defaultLayout = async () => <>
  <header>
    <a href="/">Home</a>
  </header>

  <main></main>

  <footer>
    <hr />
    <p>My Epic Blog Circa {new Date().getFullYear()}</p>
  </footer>
</>;`
    },
    {
      Name: 'Update home styles',
      Description: 'Let\'s add just a tad of css here - <code>src/pages/home/home.module.css</code>.',
      Snippet: `
.container {
  display: block;
}

.container ul {
  list-style: none;
  margin: 0;
  padding: 0;
}`
    },
    {
      Name: 'Update post styles',
      Description: 'And another dash of styles on the post page - <code>src/pages/post/post.module.css</code>.',
      Snippet: `.container {
  display: block;
}

.imageWrapper {
  width: 100%;
  max-height: 60vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.imageWrapper img {
  height: 100%;
  width: 100%;
}`
    },
    {
      Name: 'Create post card component',
      Description: `<p>We can do better than just having links to our posts. Listing them as "cards" would give us more options and feel nicer.</p>
<p>Let's create a component for encapsulating a post card.</p>`,
      Snippet: `cd src/components
fyord generate component postCard`
    },
    {
      Name: 'Implement post card component',
      Description: 'Update <code>postCard.tsx</code> with the following:',
      Snippet: `import { Component, ParseJsx } from 'fyord';
import { IPost } from '../../core/contentTypes/iPost';
import styles from './postCard.module.css';

export class PostCard extends Component {
  constructor(private post: IPost) {
    super();
  }

  Template = async () => <a class={styles.container} href={\`/posts/\${this.post.slug}\`}>
    <h2>{this.post.title}</h2>
    <p>{new Date(this.post.date).toLocaleDateString()}</p>
    <p>{this.post.description}</p>
  </a>;
}`
    },
    {
      Name: 'Add styles to post card component',
      Description: 'Spruce it up a bit by adding the following to <code>postCard.module.css</code>:',
      Snippet: `.container {
  display: block;
  border: 1px solid black;
  margin-bottom: 40px;
  text-decoration: none;
  color: black;
}

.container:visited {
  color: black;
};

.container h2 {
  background-color: black;
  color: white;
  margin: 0;
  padding: 10px;
}

.container p {
  margin: 0;
  padding: 10px;
}`
    }
  ]
};
