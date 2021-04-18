import { Mock, Times } from 'tsmockit';
import { CopyStringToClipboard } from '../copyStringToClipboard';

describe('CopyStringToClipboard', () => {
  const mockDocument = new Mock<Document>();
  const div = document.createElement('div');
  const textarea = document.createElement('textarea');

  beforeAll(() => {
    mockDocument.Setup(d => d.createElement('textarea'), textarea);
    mockDocument.Setup(d => d.body, div);
    mockDocument.Setup(d => d.execCommand('copy'));
  });

  it('should copy a string to clipboard', () => {
    CopyStringToClipboard('test', mockDocument.Object);
    mockDocument.Verify(d => d.execCommand('copy'), Times.Once);
  });
});
