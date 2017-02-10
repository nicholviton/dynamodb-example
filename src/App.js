import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
require('aws-sdk/dist/aws-sdk');
var AWS = window.AWS;

// Retrieve



class App extends Component {

  constructor() {
    super();
    this.state = {
      dynamodb: null,
    }
  }

  getDynamoDB() {
    console.log('initDynamoDB function');
    if (this.state.dynamodb == null) {
      AWS.config.update({
        region: "us-west-2",
        endpoint: "http://localhost:8000",
        accessKeyId: "AKIAILR64FOZ66RAOTXA",
        secretAccessKey: "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",
      });
      console.log('after config update');
      
      //var dynamodb = new AWS.DynamoDB({ region: 'us-east-1' });
      var dynamodb = new AWS.DynamoDB();
      this.setState({
        dynamodb: dynamodb, 
      });
      console.log('after dynamodb');
      return dynamodb;
    }
    return this.state.dynamodb;
  }

  listTables() {
    //this.getDynamoDB();
    // something else
  }

  createNewTable() {
    var inputElement = document.getElementById("DBNameText");
    if (inputElement != null) {
      var tableName = inputElement.value;
      if (tableName === "") {
        alert('Please enter the name of the new person');
      }
      else {

        var params = {
            TableName : tableName,
            KeySchema: [       
                { AttributeName: "year", KeyType: "HASH"},  //Partition key
                { AttributeName: "title", KeyType: "RANGE" }  //Sort key
            ],
            AttributeDefinitions: [       
                { AttributeName: "year", AttributeType: "N" },
                { AttributeName: "title", AttributeType: "S" }
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 10, 
                WriteCapacityUnits: 10
            }
        };

        var dynamodb = this.getDynamoDB();
        if (dynamodb != null) {
          console.log("about to create a table");
          dynamodb.createTable(params, function(err, data) {
              if (err) {
                  console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
              } else {
                  console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
              }
          });
        }
        else {
          console.log("no db?");
        }
      }
    }
  }

  callAWSDynamoDB() {
    /*dynamodb.batchGetItem(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });*/
    //this.createNewTable("Movie3");

  } 
/*
  connectToMongo() {
    var mongoDB = require('mongodb');
    var MongoClient = mongoDB.MongoClient;
    MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
      if(!err) {
        console.log("We are connected");
      }
    });
  }*/

  render() {
    this.callAWSDynamoDB();
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <input id="DBNameText" name="DBNameText" className="DB Name" type="text"/> 
        <button onClick={() => this.createNewTable()}> Create Table </button>
      </div>
    );
  }
}

export default App;
