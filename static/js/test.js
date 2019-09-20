var url = "/bmi";
function prepData(response){
  var bmi=[];
  var tot_medals=[];
  response.map(function(arr){
    bmi.push(arr[0]);
    tot_medals.push(arr[1]);

  })
  return {
    bmi:bmi,
    tot_medals:tot_medals
  }
}
function parseCountryMedals(response) {
   var mytraces=[];
  for(var i=0;i<1;i++){
    var keys=Object.keys(response)[i];
     var trace={
       x:response.bmi,
       y:response[keys],
       name:keys,
       type: 'bar'
     };
     mytraces.push(trace)
   }
    return mytraces;
  }

function buildPlot() {
  d3.json(url).then(function(response) {

    console.log(response);

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

var data =parseCountryMedals(prepData(response));

var layout = {barmode: 'stack'};


    Plotly.newPlot("plot", data, layout);
  });
};

// parseCountryMedals();

buildPlot();