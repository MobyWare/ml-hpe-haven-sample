var buttonCounter = 0;

function process() {
  buttonCounter += 1;
  $('button').prop('disabled', true);
  // $('#loading').css('display', 'unset'); // show gif
  // $('#concepts-wordcloud').jQCloud('destroy'); // remove word cloud
  document.getElementById('concepts-wordcloud').innerHTML = "<img src='./loading.gif' height='200' id='loading-concepts' style='display: unset'>" //show gif
  document.getElementById('positive-sentiments-wordcloud').innerHTML = "<img src='./loading.gif' height='200' id='loading-positive-sentiments' style='display: unset'>" //show gif
  document.getElementById('negative-sentiments-wordcloud').innerHTML = "<img src='./loading.gif' height='200' id='loading-negative-sentiments' style='display: unset'>" //show gif

  var url = encodeURI(document.getElementById('url').value);
  console.log(url);
  $.ajax({
  url: "/process?url="+url,
  type: 'GET',
    success: function(res) {
      $('button').prop('disabled', false);
      $('#loading-concepts').css('display', 'none');
      $('#loading-positive-sentiments').css('display', 'none');
      $('#loading-negative-sentiments').css('display', 'none');
      console.log(res);
      // create wordcloud
      processConcepts(res.concepts.concepts);
      processSentiments(res.sentiments.positive, 'positive');
      processSentiments(res.sentiments.negative, 'negative');
    },
    error: function(res) {
      buttonCounter -= 1;
      $('#loading-concepts').css('display', 'none');
      $('#loading-positive-sentiments').css('display', 'none');
      $('#loading-negative-sentiments').css('display', 'none');
      $('button').prop('disabled', false);
      alert("Enter a correct URL");
    }
  });
}

function processConcepts(Concepts) {
 createConceptsFrequencyList(Concepts, function(frequencyList) {
  //  console.log(frequencyList);
   if (buttonCounter > 1) {
     $('#concepts-wordcloud').jQCloud('update', frequencyList);
   } else {
     $('#concepts-wordcloud').jQCloud(frequencyList, {
       autoResize: true,
       delay: 50,
       fontSize: {
         from: 0.1,
         to: 0.02
       },
       afterCloudRender: function() {
         $('[data-toggle="popover"]').popover()
       }
       // width: width,
       // height: 200
       // colors: ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976", "#ffeda0", "#ffffcc"]
     });
   }
 });
}

function createConceptsFrequencyList(concepts, callback) {
  var frequencyList = [];
  // console.log(concepts);
  for (var i=0; i<concepts.length; i++) {
    var text = concepts[i].concept;
    var weight = concepts[i].occurrences;
    var numWords = text.split(' ').length
    var numCharacters = text.split('').length
    if (numCharacters > 1) {
      if (numWords < 4) {
        frequencyList.push({"text": text, "weight": weight, "html": {"data-toggle": "popover", "data-original-title": text, "data-trigger": "hover", "rel": "popover", "data-content": "occurrences: "+weight}});
      }
    }
  }
  // console.log(frequencyList)
  callback(frequencyList);
}

function processSentiments(Sentiments, sentiment) {
  if (sentiment == 'positive') {
      var colors = ["#008000", "#138808", "#78866B", "#03C03C", "	#87A96B", "#85BB65", "#93C572", "#77DD77", "#ACE1AF"];
  } else if (sentiment == 'negative') {
    var colors = ["#D73B3E", "#E34234", "#CD5C5C", "#FF0000", "#FF0800", "#FF1C00", "#FF5C5C", "#FF6961", "#F4C2C2"];
  }
  createSentimentsFrequencyList(Sentiments, function(frequencyList) {
    // console.log(frequencyList);
    // console.log("sentiment", sentiment);
    if (buttonCounter > 1) {
      $('#'+sentiment+'-sentiments-wordcloud').jQCloud('update', frequencyList);
    } else {
      $('#'+sentiment+'-sentiments-wordcloud').jQCloud(frequencyList, {
        autoResize: true,
        delay: 50,
        fontSize: {
          from: 0.1,
          to: 0.02
        },
        colors: colors,
        afterCloudRender: function() {
          $('[data-toggle="popover"]').popover()
        }
        // width: width,
        // height: 200
        // colors: ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976", "#ffeda0", "#ffffcc"]
      });
    }
  });
}

function createSentimentsFrequencyList(sentiments, callback) {
  // console.log(sentiments);
  var frequencyList = [];
  for (var i=0; i<sentiments.length; i++) {
    var text = sentiments[i].topic;
    var weight = sentiments[i].score
    if (text != null) {
      frequencyList.push({"text": text, "weight": Math.abs(weight), "html": {"data-toggle": "popover", "data-original-title": text, "data-trigger": "hover", "rel": "popover", "data-content": "score: "+weight}});
    }
  }
  callback(frequencyList);
}

$('#about').colorbox({href:"./about", opacity: "1",  height: '20%', width: '40%'});

$("#url").keyup(function(event){
    if(event.keyCode == 13){
        $("#submit").click();
    }
});
