var url = "/CountryMedals";
function prepData(response){
  var gold=[];
  var silver=[];
  var bronze=[];
  var countries=[];
  response.map(function(arr){
    countries.push(arr[0]);
    gold.push(arr[1]);
    silver.push(arr[2]);
    bronze.push(arr[3]);
​
  })
  return {
    gold:gold,
    silver:silver,
    bronze:bronze,
    countries:countries
  }
}
function parseCountryMedals(response) {
   var mytraces=[];
  for(var i=0;i<3;i++){
    var keys=Object.keys(response)[i];
     var trace={
       x:response.countries,
       y:response[keys],
       name:keys,
       type: 'bar'
     };
     mytraces.push(trace)
   }
    return mytraces;
  }
​
function buildPlot() {
  d3.json(url).then(function(response) {
​
    console.log(response);
​
//     var trace1 = {
//   x: ['giraffes', 'orangutans', 'monkeys'],
//   y: [20, 14, 23],
//   name: 'SF Zoo',
//   type: 'bar'
// };
//
// var trace2 = {
//   x: ['giraffes', 'orangutans', 'monkeys'],
//   y: [12, 18, 29],
//   name: 'LA Zoo',
//   type: 'bar'
// };
​
var data =parseCountryMedals(prepData(response));
​
var layout = {barmode: 'stack'};
​
    Plotly.newPlot("plot", data, layout);
  });
}
​
// parseCountryMedals();
​
buildPlot();