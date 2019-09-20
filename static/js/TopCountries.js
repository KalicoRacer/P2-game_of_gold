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

function buildPlot() {
  d3.json(url).then(function(response) {

    console.log(response);

var data =parseCountryMedals(prepData(response));

var layout = {
    title: {
      text:'Total Medal Count for Countries with > 50 Medals Earned',
      font: {
        family: 'font-family: Geneva,Tahoma,Verdana,sans-serif',
        size: 24
      },
      xref: 'paper',
      x: 0.05,
    },
    xaxis: {
      title: {
        text: 'Top Countries',
        font: {
          family: 'font-family: Geneva,Tahoma,Verdana,sans-serif',
          size: 18,
          color: '#000000'
        }
      },
    },
    yaxis: {
      title: {
        text: 'Medal Count',
        font: {
          family: 'font-family: Geneva,Tahoma,Verdana,sans-serif',
          size: 18,
          color: '#000000'
        }
      }
    }
  };

    Plotly.newPlot("topCountries", data, layout);
  });
};

// parseCountryMedals();

buildPlot();