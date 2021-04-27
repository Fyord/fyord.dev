/* eslint-disable max-len */
export type Documentation = {
  Name: string,
  Description: string,
  Snippet?: string,
  CliSnippet?: string,
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
    Name: 'Component',
    Description: 'Base class for all fyord components',
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
<p>For more details, visit the <a href="https://dev.azure.com/joseph-w-bayes/tsbase/_wiki/wikis/tsbase.wiki/396/EventStore" target="_blank">tsbase EventStore docs</a>.</p>`
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
    Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    Name: 'Cli',
    Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  }
];
