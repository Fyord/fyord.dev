export type Documentation = {
  Name: string,
  Description: string,
  Snippet?: string,
  CliSnippet?: string,
  Children?: {
    Name: string,
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
    Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    Children: [
      {
        Name: 'Render',
        Description: 'Returns renderable html content.'
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
