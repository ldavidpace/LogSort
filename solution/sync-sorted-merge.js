"use strict";

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  let sources = logSources.map((source) => {
    return {
      next: source.pop(),
      source,
    }
  });
  
  while(sources.some(source => source.next)) {
    const nextLogSource = sources.reduce((agg, curr) => {
      if (curr.next?.date.getTime() < agg.next?.date.getTime()) {
        return curr;
      }
      return agg;
    });
    printer.print(nextLogSource.next);
    nextLogSource.next = nextLogSource.source.pop();
    sources = sources.filter(source => source.next);
  }
  printer.done();
};
