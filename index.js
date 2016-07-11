//require('dotenv').load() //seems this is needed to load environment variables

var path = require('path')
var express = require('express')
var app = express()


app.use(express.static(path.join(__dirname, 'public')))

//Reference haven api
var havenondemand = require('havenondemand')
var client = new havenondemand.HODClient(process.env.HOD_APP_KEY_DEV) //store API key in environment variable

var port = process.env. PORT || 5000

//Handle a request to root
app.get(
  '/',
  function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'))
  }
)

app.get('/process', function(req, res) {
  var url = req.query.url
  var data = {url: url}
  client.call('extractconcepts', data, function(err1, resp1, body1) {
    if (err1) {
      console.log(err1)
      res.sendStatus(500)
    } else {
      console.log('Extracted concepts')
      var conceptsPayload = resp1.body
      client.call('analyzesentiment', data, function(err2, resp2, body2) {
        if (err2) {
          console.log(err2)
          res.sendStatus(500)
        } else {
          console.log('Extracted sentiments')
          var sentimentsPayload = resp2.body
          res.status(200).json({concepts: conceptsPayload, sentiments: sentimentsPayload})
        }
      })
    }
  })
})

//Start app on port given
app.listen(
  port, function(){
    console.log('Listening on port: ' + port)

  }
)
