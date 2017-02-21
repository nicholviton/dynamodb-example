import React, { Component } from 'react';
import './App.css';
import Button from 'react-bootstrap/lib/Button';
import Table from 'react-bootstrap/lib/Table';
import TableData from './TableData.js';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import AppNavBar from './appnavbar.js';
import Tables from './Tables.js';

require('aws-sdk/dist/aws-sdk');
var AWS = window.AWS;

const Container = (props) => <div>
  <AppNavBar/>
  {props.children}
  </div>

class App extends Component {

  getDocClient() {
    var config = require('../.env/customconfig.json');
    AWS.config.update({
      region: config.dynamodb.region,
      endpoint: config.dynamodb.endpoint,
      accessKeyId: config.dynamodb.accessKeyId,
      secretAccessKey: config.dynamodb.secretAccessKey,
    });
    console.log('after config update');
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log('after dynamodb');
    return docClient;
  }

  getDynamoDB() {
    var config = require('../.env/customconfig.json');
    AWS.config.update({
      region: config.dynamodb.region,
      endpoint: config.dynamodb.endpoint,
      accessKeyId: config.dynamodb.accessKeyId,
      secretAccessKey: config.dynamodb.secretAccessKey,
    });
    console.log('after config update');
    
    var dynamodb = new AWS.DynamoDB();
    console.log('after dynamodb');
    return dynamodb;
  }

  render() {
//          <IndexRoute component={DynamoDBWrapper} />

    return (<Router history={hashHistory}>
        <Route path='/' component={Container}>
          <Route path='/listTableData' component={() => <TableData docClient={this.getDocClient()} /> } />
          <Route path='/listTableNames' component={() => <Tables dynamodb={this.getDynamoDB()} /> } />
        </Route>
      </Router>);
  }
}

export default App;
