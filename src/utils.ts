function domReady(f: () => void): void {
  (/in/.test(document.readyState)) ?
    setTimeout((): void => { domReady(f); }, 9) :
    f();
}

export {
  domReady
};
