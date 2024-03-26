"use strict";

// Print all entries, across all of the *async* sources, in chronological order.



module.exports = (logSources, printer) => {
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

  const continuePrintingLogs = (orderedSources, resolve) => {
    const nextLogSource = orderedSources[0];
    printer.print(nextLogSource.next);
    orderedSources = orderedSources.slice(1);
    nextLogSource.source.popAsync().then((nextMessage) => {
      nextLogSource.next = nextMessage;
      if (nextLogSource.next) {
        const nextIndex = orderedSources.findIndex(source => source.next.date.getTime() > nextLogSource.next.date.getTime());
        if (nextIndex >= 0) {
          orderedSources.splice(nextIndex, 0, nextLogSource);
        } else {
          orderedSources.push(nextLogSource);
        }
      }
      if (orderedSources.some(source => source.next)) {
        continuePrintingLogs(orderedSources, resolve);
      } else {
        resolve();
      }
    });
  }

  return Promise.all(sources.map(source => source.nextPromise)).then(() => {
    sources.sort((a,b) => a.next.date.getTime() - b.next.date.getTime() );  
    return new Promise((resolve, reject) => {
      continuePrintingLogs(sources, resolve);
    }).then(() => {
      printer.done();
    });
  });

};
