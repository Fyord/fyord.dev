import { RenderModes, TestHelpers } from 'fyord';
import { NotFound } from './notFound';

describe('NotFound', () => {
  let classUnderTest: NotFound;
  const pageMocks = TestHelpers.GetComponentMocks();

  beforeEach(() => {
    classUnderTest = new NotFound(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should have the correct render mode', () => {
    expect(classUnderTest.RenderMode = RenderModes.Hybrid);
  });

  it('should return true for all routes', () => {
    expect(classUnderTest.Route()).toBeTruthy();
  });

  it('should render template', async () => {
    expect(await classUnderTest.Template()).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    document.body.innerHTML = await classUnderTest.Render();

    setTimeout(() => {
      // fire any attached events
    });

    const behaviorExpectationsMet = await TestHelpers.TimeLapsedCondition(() => {
      return true; // assertions proving expected behavior was met
    });
    expect(behaviorExpectationsMet).toBeTruthy();
  });
});
