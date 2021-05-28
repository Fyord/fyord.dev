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
<p>Ensure you have <a href="https://nodejs.org/en/" target="_blank">node/npm</a> and <a href="https://git-scm.com/" target="_blank">git</a> installed before continuing.</p>
<p>After running the given commands, checkout the running site at http://localhost:4200.</p>
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
      Description: `<p>Use the given command(s) to install the Contentful sdk and scaffold a new singleton service.</p>
<p>You could also scaffold this service anywhere you like, the given snippet is just a convenience.</p>`,
      Snippet: `npm i contentful @contentful/rich-text-types
mkdir src/services && touch src/services/module.ts && cd src/services
fyord generate singleton contentful
      `
    },
    {
      Name: 'Add a Type to Represent Posts',
      Description: `<p>Soon we'll be pulling in posts from Contentful. Let's make working with that data easier by creating a type we can use.</p>
<p>Add the given snippet as a file wherever you like (ex. src/contentTypes/iPost.ts):</p>`,
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
<p>Update the <em>src/services/contentful/contentful.ts</em> with the given snippet.</p>
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
<p>Update the line starting with "connect-src" in your <em>index.html</em> with the given snippet, replacing "SPACE_ID" with your space id:</p>`,
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
<p>This page's route function will be quite a bit different. Consider that this page will have a different title depending on the post data. Also consider how 404/not found functionality should work.</p>
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
      Name: 'Update base styles',
      Description: '<p>Let\'s update the base styles at <code>src/styles/base.css</code>. These global styles apply to every component.</p>',
      Snippet: `@import './normalize.css';
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400&display=swap');

* {
  box-sizing: border-box;
}

body {
  font-family: Rubik, Arial, Helvetica, sans-serif;
  margin: 20px;
}

header ul {
  display: flex;
}

header ul li {
  margin-right: 20px;
}

main {
  min-height: calc(80vh);
}

ul {
  list-style: none;
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
    },
    {
      Name: 'Use post card component in home page',
      Description: `<p>Now that we have the post card component implemented, let\'s use it in our list page.</p>
<p>Update your list in <code>src/pages/home/home.tsx</code> with the list shown in the snippet. Notice how the Promise.all syntax allows us to use <code>Array.map</code> asynchronously.</p>`,
      Snippet: `<ul>
  {await Promise.all(entries.items.map(async e => <li>
    {await new PostCard(e.fields).Render()}
  </li>))}
</ul>`
    },
    {
      Name: 'Create a search page',
      Description: `<p>Eventually we'll have so many blog posts that it might be difficult to find certain ones.</p>
<p>Let's go ahead and make a search page that allows users to filter our blogs based on a search term they enter.</p>
<p>Use the cli to scaffold the new page by entering:</p>`,
      Snippet: `cd src/pages
fyord g p search`
    },
    {
      Name: 'Implement the search page',
      Description: `<p>Update <code>search.tsx</code> from the page you just scaffolded with the given code.</p>
<p>Our search page will have the following features:</p>
<ul>
  <li>Input that actively filters posts as the user types</li>
  <li>Results presented using our post card component</li>
  <li>Query parameter support allowing linking to search results - /search?query=post</li>
</ul>
<p>The <code>searchTerm</code> property decorated with <code>@State</code> is the bit of magic that triggers our component to re-render and display new results as the user is typing. Checkout the <a href="/docs/state%20decorators">State Decorators</a> docs for more info.</p>
<p>This page is also a good example of event binding in fyord. Notice the form and input have onsubmit and oninput bound respectively. Adding event listeners in fyord is a simple as prefixing "on" in front of any <a href="https://www.w3schools.com/jsref/dom_obj_event.asp" target="_blank">valid dom event</a>.</p>`,
      Snippet: `import { Page, ParseJsx, Fragment, Route, State } from 'fyord';
import { IPost } from '../../core/contentTypes/iPost';
import { Contentful } from '../../core/services/module';
import { Queryable } from 'tsbase/Collections/Queryable';
import styles from './search.module.css';
import { PostCard } from '../../components/module';

const searchInputId = 'searchInput';

export class Search extends Page {
  Title = 'Search';
  @State searchTerm = '';
  private posts!: Array<IPost>;
  private get searchInputValue(): string {
    return (document.getElementById(this.Ids(searchInputId)) as HTMLInputElement).value;
  }
  private get searchResults(): Array<IPost> {
    return Queryable.From(this.posts).Search(this.searchTerm).Item;
  }

  private onSubmit = (e: Event | null): void => {
    e?.preventDefault();
    this.App.Router.RouteTo(\`/search?query=\${this.searchTerm}\`);
  }

  Route = async (route: Route) => {
    const match = route.path === '/search';

    if (match) {
      this.searchTerm = route.queryParams.get('query') || '';

      const entries = await Contentful.Instance().GetEntries<IPost>({
        content_type: 'post'
      });
      this.posts = entries.items.map(e => e.fields);
    }

    return match;
  }


  Template = async (route?: Route) => {
    return <div class={styles.container}>
      <h1>Search My Blog</h1>

      <form onsubmit={this.onSubmit}>
        <input id={this.Ids(searchInputId)} type="search"
          placeholder="search keyword"
          oninput={() => this.searchTerm = this.searchInputValue}
          value={route?.queryParams.get('query') || ''}>
        </input>
      </form>

      <section>
        {this.searchTerm.trim().length >= 3 ?
          <>
            {this.searchResults.length >= 1 ?
              <ul>
                {await Promise.all(this.searchResults.map(async r => <li>
                  {await new PostCard(r).Render()}
                </li>))}
              </ul> :
              <p>No results for "{this.searchTerm}"</p>}
          </> :
          <p>Start typing to search...</p>}
      </section>
    </div>;
  }
}`
    },
    {
      Name: 'Fix the tests',
      Description: `<p>Up to this point we've ignored the spec files that have been scaffolded alongside our pages, components, etc.</p>
<p>Let's take a few minutes to fix the tests we already have and see where that puts us coverage wise.</p>
<p>Run <code>npm run test-once | npm run test</code> in your terminal to run the test suite.</p>
<p>Now, go forth and correct the errors in the tests. Most should be relatively easy to correct. If you get stumped feel free to use the below references to cheat ;)</p>
<ul>
  <li>
    <details>
      <summary>home</summary>
<pre><code>import { RenderModes, Route, TestHelpers, Asap } from 'fyord';
import { Home } from './home';

describe('Home', () => {
  let classUnderTest: Home;
  const pageMocks = TestHelpers.GetComponentMocks();

  beforeEach(() => {
    classUnderTest = new Home(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should have the correct render mode', () => {
    expect(classUnderTest.RenderMode = RenderModes.Hybrid);
  });

  it('should return true for routes that match', async () => {
    const route = { path: '/' } as Route;
    expect(await classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', async () => {
    const route = { path: '/not-found' } as Route;
    expect(await classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render template', async () => {
    expect(await classUnderTest.Template()).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    document.body.innerHTML = await classUnderTest.Render();

    Asap(() => {
      // fire any attached events
    });

    const behaviorExpectationsMet = await TestHelpers.TimeLapsedCondition(() => {
      return true; // assertions proving expected behavior was met
    });
    expect(behaviorExpectationsMet).toBeTruthy();
  });
});</code></pre>
    </details>
  </li>
  <li>
    <details>
      <summary>post</summary>
      <code><pre>import { RenderModes, Route, TestHelpers, Asap } from 'fyord';
import { Mock } from 'tsmockit';
import { IContentful } from '../../core/services/module';
import { Post } from './post';
import { IPost } from '../../core/contentTypes/iPost';

describe('Post', () => {
  let classUnderTest: Post;
  const pageMocks = TestHelpers.GetComponentMocks();
  const mockContentful = new Mock<IContentful>();
  const fakeEntry = {
    title: 'test'
  } as IPost;

  beforeEach(() => {
    mockContentful.Setup(c => c.GetEntries({}), { items: [ { fields: fakeEntry }] });

    classUnderTest = new Post(
      mockContentful.Object,
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should have the correct render mode', () => {
    expect(classUnderTest.RenderMode = RenderModes.Hybrid);
  });

  it('should return true for routes that match', async () => {
    const route = { path: '/posts/test', routeParams: ['post', 'test'] } as Route;
    expect(await classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', async () => {
    const route = { path: '/not-found' } as Route;
    expect(await classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render template', async () => {
    classUnderTest['post'] = fakeEntry;
    expect(await classUnderTest.Template()).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    classUnderTest['post'] = fakeEntry;
    document.body.innerHTML = await classUnderTest.Render();

    Asap(() => {
      // fire any attached events
    });

    const behaviorExpectationsMet = await TestHelpers.TimeLapsedCondition(() => {
      return true; // assertions proving expected behavior was met
    });
    expect(behaviorExpectationsMet).toBeTruthy();
  });
});</code></pre>
    </details>
  </li>
  <li>
    <details>
      <summary>search</summary>
      <code><pre>import { RenderModes, Route, TestHelpers, Asap } from 'fyord';
import { Search } from './search';

describe('Search', () => {
  let classUnderTest: Search;
  const pageMocks = TestHelpers.GetComponentMocks();

  beforeEach(() => {
    classUnderTest = new Search(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should have the correct render mode', () => {
    expect(classUnderTest.RenderMode = RenderModes.Hybrid);
  });

  it('should return true for routes that match', async () => {
    const route = { path: '/search', queryParams: new Map<string, string>() } as Route;
    expect(await classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', async () => {
    const route = { path: '/not-found' } as Route;
    expect(await classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render template', async () => {
    expect(await classUnderTest.Template()).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    document.body.innerHTML = await classUnderTest.Render();

    Asap(() => {
      // fire any attached events
    });

    const behaviorExpectationsMet = await TestHelpers.TimeLapsedCondition(() => {
      return true; // assertions proving expected behavior was met
    });
    expect(behaviorExpectationsMet).toBeTruthy();
  });
});</code></pre>
    </details>
  </li>
</ul>
<p>Once you get em all passing, open the test coverage report at <code>coverage/lcov-report/index.html</code></p>
<p>Not too bad for just keeping the tests the cli gave you passing right?</p>
<p>If you feel up to it, see if you can close some of the coverage gaps. For what it's worth, the Fyord framework has 100% statement and branch coverage and that bar is definitely within reach for any Fyord app. But, we'll dive into that subject in more detail in another tutorial.</p>`
    },
    {
      Name: 'Add a pipeline',
      Description: `<p>This project definitely needs a pipeline. Let's scaffold one with the cli. Yeah, the cli is pretty handy isn't it.</p>
<p>Use the given command to scaffold a github action that will run on all pull requests and merges to master.</p>
<p>Exchange 'github' for 'azure' if you'd rather use Azure Pipelines.</p>
<p>After the pipeline is generated, push that bad boy and watch it run. Also checkout the public artifact. This is what we'll want to deploy.</p>`,
      Snippet: 'fyord g pipeline github master'
    },
    {
      Name: 'Add a firebase project',
      Description: `<p>Speaking of deployment, let\'s go ahead and get a firebase project setup to deploy to.</p>
<ol>
  <li>Head over to <a href="https://console.firebase.google.com/" target="_blank">https://console.firebase.google.com</a> and setup an account</li>
  <li>Once you get past the intro spiel, add a new project by clicking the "add project" button</li>
  <li>Name it whatever you like, click continue, and feel free to uncheck any add ons related to analytics they try to push on you</li>
  <li>That's all for now. Firebase has a bunch of cool features, and in the next step(s) we'll be taking advantage of the hosting</li>
</ol>`
    },
    {
      Name: 'Firebase init in our project',
      Description: `<p>The given commands will hook you up with the firebase cli globally as well as in your local project</p>
<p>We'll need it in the local project in a later step.</p>
<p>It'll also have you login, which will let the firebase cli know how to find that project we made.</p>
<p>After logging in, just follow the steps in the init command to select the following:</p>
<ul>
  <li>Hosting</li>
  <li>Use an existing project</li>
  <li>{your project name}</li>
  <li>press enter for default "public" directory</li>
  <li>Enter "n" to not configure as a single page app (since we'll be pre-rendering)</li>
  <li>Enter "n" for automatic builds in github, we'll just amend our existing pipeline</li>
  <li>Then, once again enter "n" to not overwrite any index.html file that may be in our public directory</li>
</ul>`,
      Snippet: `npm i -g firebase-tools
npm i --save-dev firebase-tools
firebase login
firebase init`
    },
    {
      Name: 'Update firebase.json',
      Description: 'Update your firebase.json file to the given value',
      Snippet: `{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "cleanUrls": true
  }
}`
    },
    {
      Name: 'Update package scripts',
      Description: 'We need to make a slight modification to our build to generate a 404.html for firebase hosting. Add/update the given commands in package.json.',
      Snippet: `"build": "webpack --config webpack.prod.js && npm run addNotFoundPage",
"addNotFoundPage": "cp public/index.html public/404.html",
"deploy": "firebase deploy --token $FIREBASE_TOKEN"`
    },
    {
      Name: 'Get CI deploy token',
      Description: `<p>In order to give GitHub access to deploy our site to firebase, it'll need a deploy token</p>
<p>Execute the given command to generate one. Sign in if/when a browser window pops up, then copy the token that outputs to the terminal.</p>
<p>Next go to your GitHub project > settings > secrets > new repository secret. Use the name "FIREBASE_TOKEN" and paste the token in the value space.</p>`,
      Snippet: 'firebase login:ci'
    },
    {
      Name: 'Update pipeline with deploy step',
      Description: 'Now, just update the pipeline we created earlier by adding the given step to the bottom (.github/workflows/ci.yml). This step will trigger a deploy on merges to your trunk branch (master).',
      Snippet: `- name: Deploy
  if: \${{ github.event_name != 'pull_request' }}
  env:
    FIREBASE_TOKEN: \${{ secrets.FIREBASE_TOKEN }}
  run: npm run deploy`
    },
    {
      Name: 'You did it!',
      Description: `<p>Push your changes, and watch your brand new blog get deployed to firebase!</p>
<p>The pipeline output will contain your site's address, or you can hop back over to the <a href="https://console.firebase.google.com/" target="_blank">firebase console</a> and find it there.</p>
<p>You've just built an end-to-end, no bullshit, full-stack blog and even got it deployed!</p>
<p>Take a moment, pat yourself on the back, play around with what you've built. Iterate on it. Since you have a continuous delivery pipeline every commit to master will end up deployed with no effort on your part.</p>
<p>Now would also be a good time to checkout the pre-rendering. Feel free to view page source on any page.</p>
<p>The pre-rendering also adds to extra files to help you out with seo / know which pages are pre-rendered. They are "/sitemap.json" and "/sitemap.xml"; try fetching those as well. You may notice that the origin isn't quite right (http://localhost:7343), this is because the pre-rendering happens via an node express server at build time.</p>
<p>Run the configure command and past your real origin when prompted for "baseUrl" to correct this.</p>`,
      Snippet: 'fyord configure'
    }
  ]
};
