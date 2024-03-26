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
  while(sources.some(source => source.next)) {
    const nextLogSource = sources.reduce((agg, curr) => {
      if (curr.next?.date.getTime() < agg.next?.date.getTime()) {
        return curr;
      }
      return agg;
    });
    printer.print(nextLogSource.next);
    nextLogSource.next = await nextLogSource.source.popAsync();
    sources = sources.filter(source => source.next);
  }
  printer.done();
};
