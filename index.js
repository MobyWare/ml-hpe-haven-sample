var path = require('path')
var express = require('express')
var app = express()


app.use(express.static(path.join(__dirname, 'public')))

//Reference haven api
var havenondemand = require('havenondemand')
var client = new havenondemand.HODClient('3ef4a08d-c36a-4191-9a72-1ef761d80ea3')

var port = process.env. PORT || 5000

//Handle a request to root
app.get(
  '/',
  function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'))
  }
)

app.get(
  '/process',
  function(req, res){
    var url = req.query.url
    var data = {'url':url}

    //Make the call to HOD.
    client.call(
      'analyzesentiment',
      data,
      function(err, resp, body){
        if(err){
          console.log(err)
          res.sendStatus(500)
        }
        else{
          console.log('Analyzed sentiment!')
          var sentiments = resp.body
        }

        //Now we call the concept extraction api
        client.call(
          'extractconcepts',
          data,
          function(err, resp, body){
            if(err){
              console.log(err)
              res.sendStatus(500)
            }
            else{
              console.log('Extracted concepts!')
              var concepts = resp.body
              res.sendStatus(200).json({'sentiments': sentiments, 'concepts':concepts})
            }
          }
        )

      }
    )


  }
)

//Start app on port given
app.listen(
  port, function(){
    console.log('Listening on port: ' + port)

  }
)
