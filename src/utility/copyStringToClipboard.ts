export function CopyStringToClipboard(str: string, mainDocument: Document = document): void {
  const el = mainDocument.createElement('textarea') as HTMLTextAreaElement;
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';

  mainDocument.body.appendChild(el);
  el.select();

  mainDocument.execCommand('copy');
  mainDocument.body.removeChild(el);
}
