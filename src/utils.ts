export default function domReady(f: () => void): void {
  if (/in/.test(document.readyState)) {
    setTimeout((): void => { domReady(f); }, 9);
    return;
  }

  f();
}
