import React, { Component } from 'react';
import Table from 'react-bootstrap/lib/Table';
import Button from 'react-bootstrap/lib/Button';

class TableData extends Component {

  constructor() {
    console.log('int tabledata');
    super();
    this.state = {
      tableData: null
    }
  }

  getTableName() {
    var inputElement = document.getElementById("DBNameText");
    if (inputElement != null) {
      var tableName = inputElement.value;
      if (tableName === "") {
        alert('Please enter the name of the new person');
      }
      return tableName;
    }
    return null;
  }

  addItemsToTable() {
    var tableName = this.getTableName();
    if (tableName == null) return;

    var docClient = this.props.docClient;
    if (docClient == null) return;

    var params = {
      TableName: tableName,
      Item:{
        "year": 2000,
        "title": "some title",
        "info":{
            "plot": "Nothing happens at all.",
            "rating": 0
        }
      }
    };
    docClient.put(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  }

  listItemsInTable() {
    var tableName = this.getTableName();
    if (tableName == null) return;
    console.log('table name: ' + tableName);
    
    var docClient = this.props.docClient;
    if (docClient == null) return;
    console.log('doc client');
    
    var params = {
        TableName: tableName,
        Key:{
            "year": 2000,
            "title": "some title"
        }
    };

    docClient.get(params, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
          if (data != null && data.Item != null) {
            var tableData = new Array(1); 
            tableData[0] = {
              year: data.Item.year, 
              title: data.Item.title,
              rating: data.Item.info.rating,
              plot: data.Item.info.plot,
            };
            this.setState({
              tableData: tableData,
            });
          }
      }
    }.bind(this));
  }

  renderHeader() {
    return (
      <div className="TableDataAll">
        <p>
        <input id="DBNameText" name="DBNameText" className="DB Name" type="text"/>
        <Button bsStyle="primary" onClick={() => this.listItemsInTable()}> List Items in Table </Button>
        </p>
        <p>
        <Button bsStyle="primary" onClick={() => this.addItemsToTable()}> Add Items to Table </Button>
        </p>
      </div>
    );
  }

  render() {
    var tableData = this.state.tableData;
    console.log('render table names');
    if (tableData == null) {
      return <div>{this.renderHeader()};</div>
    }

    console.log('about to render the names');
    return (
      <div className="TableData">
        {this.renderHeader()}
        <h2>Table Data</h2>

        <Table striped bordered condensed hover>
          <thead>
          <tr>
              <th>Year</th>
              <th>Title</th>
              <th>Rank</th>
              <th>Plot</th>
          </tr>
          </thead>
          <tbody>
            {tableData.map(function(item, i) {
              return <tr key={i}>
                  <td>{item.year}</td>
                  <td>{item.title}</td>
                  <td>{item.rank}</td>
                  <td>{item.plot}</td>
              </tr>
            })}

         </tbody>
        </Table>
      </div>);
  }
}

export default TableData; 