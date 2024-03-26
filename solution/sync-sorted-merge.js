"use strict";

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  let sources = logSources.map((source, index) => {
    return {
      next: source.pop(),
      source,
    }
  });
  sources.sort((a,b) => a.next.date.getTime() - b.next.date.getTime() );
  while(sources.some(source => source.next)) {
    const nextLogSource = sources[0];
    printer.print(nextLogSource.next);
    nextLogSource.next = nextLogSource.source.pop();
    sources = sources.slice(1);
    if (nextLogSource.next) {
      const nextIndex = sources.findIndex(source => source.next.date.getTime() > nextLogSource.next.date.getTime());
      if (nextIndex >= 0) {
        sources.splice(nextIndex, 0, nextLogSource);
      } else {
        sources.push(nextLogSource);
      }
    }
  }
  printer.done();
};
