window.onload = function() {
console.log("Hello");
};

d3.queue()
  .defer(d3.request, alldata)
  .awaitAll(loadinData);

  function loadinData(error, response) {
    if (error) throw error;
  };
