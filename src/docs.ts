/* eslint-disable max-lines */
/* eslint-disable max-len */
export type Documentation = {
  Name: string,
  Description: string,
  CliCommand?: string,
  Children?: {
    Name: string,
    Type?: string,
    Description: string,
    Snippet?: string,
  }[]
};

export const Docs: Documentation[] = [
  {
    Name: 'Cli',
    Description: 'A companion CLI to the Fyord framework',
    CliCommand: 'npm i -g fyord-cli',
    Children: [
      {
        Name: 'Help',
        Description: 'Lists all fyord commands.  Passing a command argument will list additional details about that command.',
        Type: 'fyord help | fyord h | fyord h generate'
      },
      {
        Name: 'Version',
        Description: 'Prints the version of the fyord-cli being ran.',
        Type: 'fyord version | fyord v'
      },
      {
        Name: 'New',
        Description: 'Creates a new fyord app. Optionally pass "scss" as an argument after the app name to use sass and init with the scss style extension.',
        Type: 'fyord new MyNewApp | fyord n MyNewApp | fyord n MyNewApp scss'
      },
      {
        Name: 'Generate',
        Description: `<p>Scaffold a fyord app component, page, etc. in the current directory. For components and pages, local module files are updated for greater productivity.</p>
<p>Available Types: component (c), page (p), singleton (s), pipeline (pl)</p>`,
        Type: 'fyord generate {type} | fyord g {type}'
      },
      {
        Name: 'Configure',
        Description: 'Configure settings saved in fyord.json configuration file.',
        Type: 'fyord configure | fyord c'
      },
      {
        Name: 'Pre-render',
        Description: 'Crawls and pre renders pages within the app.',
        Type: 'fyord prerender | fyord pr'
      }
    ]
  },
  {
    Name: 'Component',
    Description: 'Base class for all fyord components',
    CliCommand: 'fyord g c NewComponent',
    Children: [
      {
        Name: 'Id',
        Type: 'Id: string',
        Description: 'A unique id assigned to a component\'s root div.'
      },
      {
        Name: 'Element',
        Type: 'get Element(): HTMLElement | null',
        Description: 'Property returning the rendered component root element if rendered or null if not rendered. Use this if you need to access a component\'s rendered output directly.'
      },
      {
        Name: 'State',
        Type: 'State = new EventStore<any>()',
        Description: `<p>Manages local component state. Can be accessed directly to get and set values, subscribe to changes, inspect the event store\'s ledger, and even undo/redo changes.</p>
<p>For more details, visit the <a href="https://dev.azure.com/joseph-w-bayes/tsbase/_wiki/wikis/tsbase.wiki/396/EventStore" target="_blank">tsbase EventStore docs</a>.</p>
<p>Most of the time, you'll want to utilize this store through the @State decorator - learn more in <a href="/docs/state%20decorators#State">State decorator docs</a>.</p>`
      },
      {
        Name: 'App',
        Type: 'App = App.Instance()',
        Description: `<p>Provides access to the fyord App singleton instance. Within a component, you may reference the app to access app state, router, and more.</p>
<p>See <a href="/docs/app">App Docs</a> for more details.</p>`
      },
      {
        Name: 'Ids',
        Type: 'Ids(key: string): string',
        Description: 'Maps and returns a unique id for the given key. Use this method when you need a unique key scoped to a given component.',
        Snippet: `<input id={this.Ids('myInput')}>

const inputValue = document.getElementById(this.Ids('myInput'));`
      },
      {
        Name: 'Render',
        Type: 'Render(route?: Route, includeWrapper = true): Promise<string>',
        Description: 'Returns html content based on the component\'s Template definition. Use this method when rendering a component.',
        Snippet: `<>
  <h3>Example:</h3>
  {await new SnippetComponent(c.Snippet).Render()}
</>`
      },
      {
        Name: 'Template',
        Type: 'abstract Template: (route?: Route) => Promise<Jsx>',
        Description: 'Defines the html output representing a component once rendered.',
        Snippet: 'Template = async () => <p>hello world!</p>'
      },
      {
        Name: 'ReRender',
        Type: 'ReRender(route?: Route): Promise<void>',
        Description: 'Replaces the component\'s current rendered html content with a fresh copy. Use this method when you want to manually trigger a re-render.',
        Snippet: `componentReference.ReRender()
this.ReRender() // within component`
      }
    ]
  },
  {
    Name: 'Page',
    Description: 'A fyord component that renders on route match',
    CliCommand: 'fyord g p NewPage',
    Children: [
      {
        Name: 'RenderMode',
        Type: 'RenderMode = RenderModes.Hybrid',
        Description: 'Sets the render mode of the page - used during pre-rendering',
        Snippet: `RenderMode = RenderModes.Hybrid; /* Pre-renders, but still loads js */

RenderMode = RenderModes.Static; /* Pre-renders without a js bundle */

RenderMode = RenderModes.Dynamic; /* No pre-rendering */`
      },
      {
        Name: 'Route',
        Type: 'abstract Route: (route: Route) => boolean',
        Description: 'Sets the predicate by which a route match is determined. You may also set title and description and take other route resolution actions here.',
        Snippet: `/* Simple (home page) example */
Route = (route: Route) => route.path === '/';

/* Dynamic route - sets title and description when data available 404s when not */
Route = (route: Route) => {
  const docsName = route.routeParams?.[1];
  this.documentation = Docs.find(d => d.Name.toLowerCase() === docsName);

  if (this.documentation) {
    this.Title = this.documentation.Name;
    this.Description = this.documentation.Description;
  }

  return route.path.startsWith('/docs') && !!this.documentation;
}`
      },
      {
        Name: 'seoService',
        Type: 'seoService: ISeoService = SeoService.Instance',
        Description: 'Reference to the SeoService instance.  Learn more about this service <a href="/docs/seoservice">here</a>.'
      },
      {
        Name: 'Title',
        Type: 'Title: string = Strings.Empty',
        Description: 'Sets the page title.'
      },
      {
        Name: 'Description',
        Type: 'Description: string = Strings.Empty',
        Description: 'Sets the meta description tag.'
      },
      {
        Name: 'ImageUrl',
        Type: 'ImageUrl: string = Strings.Empty',
        Description: 'Sets the meta image url tag. This is what most platforms use to display an image when linking to a webpage.'
      }
    ]
  },
  {
    Name: 'State Decorators',
    Description: 'Extend component properties to enable change detection and other features via an event store',
    Children: [
      {
        Name: 'State',
        Description: `<p>Overrides a property\'s getter and setter to get/set values using the component event store.</p>
<p>The component is subscribed to changes and will re-render whenever they change.</p>
<p>Use when you would like a property's state change to cause a re-render or you want state to be managed via an event store (ex. for undo, redo, or transaction ledger features).</p>`,
        Type: 'function State(target: Component, key: string)',
        Snippet: `export class Counter extends Component {
  @State private counter: number = 0;

  Template = async () => <>
    <p>Counter Value: <b>{this.counter}</b></p>;
    <button onclick={() => this.counter++}>Increment</button>
    <button onclick={() => this.counter--}>Decrement</button>
  </>;
}`
      },
      {
        Name: 'AppStore',
        Description: `<p>Functions just as the State decorator, with the only difference that the event store being used is the app\'s event store vice the component\'s.<p>
<p>Use when sharing state across the session, between components for example.</p>`,
        Type: 'function AppStore(target: Component, key: string)'
      }
    ]
  },
  {
    Name: 'App',
    Description: 'A singleton pattern used to bootstrap and coordinate functionality in a Fyord app',
    Children: [
      {
        Name: 'Instance',
        Description: 'Returns the singleton App instance. Optionally pass environment variables during bootstrap to make them available throughout the app\'s life cycle.',
        Type: 'static Instance(environment?: string, productionEnvironmentVariables = new Map<string, string>(), developmentEnvironmentVariables = new Map<string, string>())',
        Snippet: ` /* index.ts */
const app = App.Instance(process.env.NODE_ENV || Environments.Production);`
      },
      {
        Name: 'Destroy',
        Description: 'Destroys the singleton App instance, allowing it to be re-instantiated.',
        Type: 'static Destroy(): void'
      },
      {
        Name: 'Main',
        Description: 'Returns the application\'s single rendered <main> element. The main element is where pages are rendered on route match.',
        Type: 'get Main(): HTMLElement'
      },
      {
        Name: 'Environment Variables',
        Description: 'Fyord provides a pattern for supporting development and production environment variables. You should <b>NOT</b> use this pattern for storing secrets or other sensitive information such as api keys or credentials.',
        Type: 'EnvironmentVariables = new Map<string, string>()',
        Snippet: `/* setting environment variables - index.ts */

(async () => {
  const devEnvironmentVariables = new Map<string, string>([
    ['backendServer', 'http://dev.com']
  ]);
  const prodEnvironmentVariables = new Map<string, string>([
    ['backendServer', 'http://prod.com']
  ]);

  const app = App.Instance(
    process.env.NODE_ENV || Environments.Production,
    prodEnvironmentVariables,
    devEnvironmentVariables
  );

  await app.Start(defaultLayout);
})();

/* using environment variables within a component */
this.App.EnvironmentVariables.get('backendServer');`
      },
      {
        Name: 'Logger',
        Description: `<p>Returns the app\'s single logger instance. In development new entries are logged as warnings to the console.  Learn more about this logger at <a href="https://dev.azure.com/joseph-w-bayes/tsbase/_wiki/wikis/tsbase.wiki/411/Logger" target="_blank">tsbase Logger docs</a>.</p>
<p>You may access the logger and log entries as shown below. Exceptions thrown in safe execution <a href="https://dev.azure.com/joseph-w-bayes/tsbase/_wiki/wikis/tsbase.wiki/231/CommandQuery" target="_blank">tsbase Command/Query</a> pattern implementations are also logged automatically.</p>`,
        Type: 'Logger.Instance',
        Snippet: `/* Subscribe to entries */
app.Logger.EntryLogged.Subscribe((e) => {
  console.log(e.Message);
});

/* Info */
const entry = new LogEntry('test');
app.Logger.Log(entry);

/* Warn */
const entry = new LogEntry('test', LogLevel.Warn);
app.Logger.Log(entry);

/* Error */
const error = new Error('something bad happened');
const entry = new LogEntry('test', LogLevel.Error, error);
app.Logger.Log(entry);

/* Access entries */
const entries = app.Logger.LogEntries;`
      },
      {
        Name: 'Store',
        Description: `<p>Manages global app state. Can be accessed directly to get and set values, subscribe to changes, inspect the event store's ledger, and even undo/redo changes.</p>
<p>For more details, visit the <a href="https://dev.azure.com/joseph-w-bayes/tsbase/_wiki/wikis/tsbase.wiki/396/EventStore" target="_blank">tsbase EventStore docs</a>.</p>`,
        Type: 'Store = new EventStore<any>()'
      },
      {
        Name: 'Layout',
        Description: '<a href="https://dev.azure.com/joseph-w-bayes/tsbase/_wiki/wikis/tsbase.wiki/379/Observable" target="_blank">Observable</a> for the active app layout. The application layout can be updated by publishing to this observable. Observers may also respond to changes in layout by subscribing to it.',
        Type: 'Layout = new Observable<Jsx>()'
      },
      {
        Name: 'Router',
        Description: 'Reference to the app\'s single router instance. Learn more about the router <a href="/docs/router">here</a>.',
        Type: 'Router: IRouter = Router.Instance()'
      },
      {
        Name: 'InitializeStore',
        Description: 'Optionally set the initial data within the global app store.',
        Type: 'InitializeStore<T>(state: T): void'
      },
      {
        Name: 'Start',
        Description: 'Set the initial layout and begin rendering / routing the Fyord application.',
        Type: 'Start(initialLayout: () => Promise<Jsx>): Promise<void>',
        Snippet: `/* index.ts */
await app.Start(defaultLayout);`
      }
    ]
  },
  {
    Name: 'Router',
    Description: 'Handles client side routing for Fyord apps',
    Children: [
      {
        Name: 'Instance',
        Description: 'Retrieves the router instance.',
        Type: 'static Instance(mainWindow: Window = window, xssSanitizer: IXssSanitizerService = XssSanitizerService.Instance()): IRouter',
        Snippet: `/* Access the router instance from anywhere */
const router = Router.Instance();

/* Access the router from within a component or page */
const router = this.App.Router;`
      },
      {
        Name: 'Route',
        Description: 'Subscribe to route changes via this observable',
        Type: 'Route = new Observable<Route>()',
        Snippet: `this.App.Router.Route.Subscribe((route?: Route) => {
  console.log(\`route changed to \${route?.path}\`);
});`
      },
      {
        Name: 'CurrentRoute',
        Description: 'Access the value of the currently resolved route',
        Type: 'CurrentRoute?: Route'
      },
      {
        Name: 'UseClientRouting',
        Description: 'Updates any rendered anchor tags to use client-side routing. Use this only when you have manually added anchor tags to the dom outside of a Fyord component\'s normal render method.',
        Type: 'UseClientRouting(): void'
      },
      {
        Name: 'RouteTo',
        Description: 'Programmatically route to the given href via client-side routing. You\'ll need to route to a page from time to time without the user clicking on an anchor tag. Use this method when that time comes.',
        Type: 'RouteTo(href: string, push = true): Route',
        Snippet: `/* From within a component or page */
this.App.Router.RouteTo('/docs');`
      }
    ]
  },
  {
    Name: 'SeoService',
    Description: 'A flexible solution for setting title and meta tags',
    Children: [
      {
        Name: 'Instance',
        Description: 'Retrieves the seo service instance.',
        Type: 'static get Instance(): SeoService { return this.instance || (this.instance = new SeoService()); }',
        Snippet: `/* Access the seo service instance from anywhere */
const seoService = SeoService.Instance;

/* Access the seo service instance from within a page */
const seoService = this.seoService;`
      },
      {
        Name: 'SetDefaultTags',
        Description: 'Sets the given title, description, and image url for a page. The parameters are optional and will default back the index.html when not set values.',
        Type: 'SetDefaultTags(title?: string, description?: string, imageUrl?: string): void',
        Snippet: `/* from within a page */
this.seoService.SetDefaultTags(this.Title, this.Description, this.ImageUrl);`
      },
      {
        Name: 'SetTitle',
        Type: 'SetTitle(title: string): void',
        Description: 'Sets the head <title> element value.'
      },
      {
        Name: 'SetDescription',
        Type: 'SetDescription(description: string): void',
        Description: 'Sets the meta description tag for a page.'
      },
      {
        Name: 'SetImageUrl',
        Type: 'SetImageUrl(imageUrl: string): void',
        Description: 'Sets the og:image meta tag for a page.'
      },
      {
        Name: 'SetMetaTags',
        Type: 'SetMetaTags(metaTags: Array<MetaTag>): void',
        Description: 'Sets any number of given meta tags for a page.'
      }
    ]
  },
  {
    Name: 'XssSanitizerService',
    Description: 'A built in service supporting the sanitization of plain text and html content',
    Children: [
      {
        Name: 'PlainText',
        Type: 'PlainText(userInput: string): string',
        Description: 'Sanitizes the given input and returns a plain text string.'
      },
      {
        Name: 'Html',
        Type: 'Html(userInput: string): string',
        Description: 'Sanitizes the given input, removing potential unsafe attributes, but allowing other html. Use this when you need to support user\'s editing content with a WYSIWYG editor.'
      }
    ]
  },
  {
    Name: 'JsxRenderer',
    Description: '',
    Children: [
      {
        Name: 'RenderJsx',
        Description: 'Returns render-able html string from the given jsx. Use this if you need to directly update an element\'s innerHTML from jsx.',
        Type: 'static RenderJsx(jsx: Jsx): string',
        Snippet: `someElement.innerHTML = JsxRenderer.RenderJsx(<>
  <h2>Muchus Lorem</h2>
  <p>Lorem ipsum dipsum wipsum</p>
</>);`
      }
    ]
  },
  {
    Name: 'FAQ',
    Description: 'Quick answers to quick questions',
    Children: [
      {
        Name: 'Can I use Sass for styles?',
        Description: `<p>Yes!</p>
<p>If you're using the cli, scaffold your project with <code>fyord new MyProjectName scss</code> to default all css files to use the .scss extension.</p>
<p>If you've already scaffolded your app, but want to switch the default to scss, run the <code>fyord configure</code> command and set the style extension setting to scss.</p>
<p>Alternatively, or if you aren't using the cli, simply change any .css file to .scss to use sass.</p>`
      },
      {
        Name: 'Can I just use JavaScript?',
        Description: `Probably, but we don't currently support vanilla JavaScript, so you'll be on your own.
<p>We intend Fyord to be TypeScript first, but will leave the door open to JavaScript support at a later time.</p>`
      },
      {
        Name: 'How to deploy a static site?',
        Description: `<ul>
  <li>Ensure all pages have their <a href="/docs/page#RenderMode">RenderMode</a> set to "static"</li>
  <li>Build your app</li>
  <li>Use the cli to <a href="/docs/cli#Pre-render">pre-render</a></li>
  <li>Deploy the "public" folder!</li>
</ul>`
      }
    ]
  },
  {
    Name: 'RawHtml',
    Description: 'An included component that supports rendering a plaintext string',
    Children: [
      {
        Name: 'With sanitization',
        Description: 'The default behavior of this component is to render html after stripping any potentially unsafe attributes. This is a good solution for rendering user generated content which may include html.',
        Snippet: `const paragraphString = '<p>hello world!</p>';

await new RawHtml(paragraphString).Render();`
      },
      {
        Name: 'Without sanitization',
        Description: 'Passing "false" to the constructor after the string to be rendered explicitly bypasses safe rendering and will allow the string to be rendered regardless of contents. You want to be careful, but this can be a good option when rendering a static string you\'ve defined in your application code.',
        Snippet: `const renderItAnyway = '<img src="fake" onerror="alert(\\'boo\\');">';

/* expects an alert */
await new RawHtml(renderItAnyway, false).Render();`
      }
    ]
  }
];
