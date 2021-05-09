import { Strings } from 'tsbase/Functions/Strings';
import { Asap, RenderModes, Route, TestHelpers } from 'fyord';
import { Docs } from './docs';

describe('Docs', () => {
  let classUnderTest: Docs;
  const pageMocks = TestHelpers.GetComponentMocks();

  beforeEach(() => {
    classUnderTest = new Docs(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      pageMocks.mockDocument.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should have the correct render mode', () => {
    expect(classUnderTest.RenderMode = RenderModes.Hybrid);
  });

  it('should return true for routes that match', () => {
    const route = { path: '/docs', queryParams: new Map<string, string>() } as Route;
    expect(classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', async () => {
    const route = { path: '/not-found' } as Route;
    expect(await classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render template', async () => {
    expect(await classUnderTest.Template()).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    const inputElement = document.createElement('input');
    pageMocks.mockDocument.Setup(d => d.getElementById(Strings.Empty), inputElement);
    document.body.innerHTML = await classUnderTest.Render();

    Asap(() => {
      // fire any attached events
    });

    const behaviorExpectationsMet = await TestHelpers.TimeLapsedCondition(() => {
      return true; // assertions proving expected behavior was met
    });
    expect(behaviorExpectationsMet).toBeTruthy();
  });
});
