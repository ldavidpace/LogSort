"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  let sources = logSources.map((source) => {
    const promise = source.popAsync();
    const sourceObject = {
      nextPromise: promise,
      source,
    }
    promise.then((message) => {
      sourceObject.next = message;
    });
    return sourceObject;
  });
  await Promise.all(sources.map(source => source.nextPromise));
  sources.sort((a,b) => a.next.date.getTime() - b.next.date.getTime() );
  
  while(sources.some(source => source.next)) {
    const nextLogSource = sources[0];
    printer.print(nextLogSource.next);
    sources = sources.slice(1);
    nextLogSource.next = await nextLogSource.source.popAsync();
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
