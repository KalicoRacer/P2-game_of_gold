var urlbmi = "/bmi";
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
function parsebmi(response) {
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
  d3.json(urlbmi).then(function(response) {

    console.log(response);

var data =parsebmi(prepData(response));

// var layout = {barmode: 'stack'};
var layout = {
  title: {
    text:'% of BMI and Total Number of Medals',
    font: {
      family: 'font-family: Geneva,Tahoma,Verdana,sans-serif',
      size: 24
    },
    xref: 'paper',
    x: 0.05,
  },
  xaxis: {
    title: {
      text: 'BMI (%)',
      font: {
        family: 'font-family: Geneva,Tahoma,Verdana,sans-serif',
        size: 18,
        color: '#000000'
      }
    },
  },
  yaxis: {
    title: {
      text: 'Total Number of Medals',
      font: {
        family: 'font-family: Geneva,Tahoma,Verdana,sans-serif',
        size: 18,
        color: '#000000'
      }
    }
  }
};

    Plotly.newPlot("plot", data, layout);
    
  });
};

// parseCountryMedals();

buildPlot();