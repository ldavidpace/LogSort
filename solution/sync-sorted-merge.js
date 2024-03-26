"use strict";

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  
  const nextMessages = getNextMessages(logSources);
  while(nextMessages.some(Boolean)) {
    nextMessages.filter(Boolean).forEach(message => printer.print(message));
  }
  printer.done();
};
