/* eslint-disable max-lines */
/* eslint-disable max-len */
export type Documentation = {
  Name: string,
  Description: string,
  CliCommand?: string,
  Children?: {
    Name: string,
    Type: string,
    Description: string,
    Snippet?: string,
  }[]
};

export const Docs: Documentation[] = [
  {
    Name: 'App',
    Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
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
        Description: 'Creates a new fyord app. Optionally pass "scss" as an argument after the app name to init with the scss style extension.',
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
    Name: 'Page',
    Description: 'A fyord component that renders on route match.',
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
  }
];
