import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';

class Tables extends Component {

	constructor() {
		super();
		this.state = {
			init: false,
			tableNames: null,
		};
	}

	listTables() {
		console.log('in list tables');
		var dynamodb = this.props.dynamodb;
		if (dynamodb != null) {
			dynamodb.listTables(function(err, data) {
				console.log("returning table names: " + data.TableNames);
				this.setState({
					init: true,
					tableNames: data.TableNames,
				});
			}.bind(this));
		}
		else {
			this.setState({
				init: true
			});
		}
	}

	createNewTable() {
		var inputElement = document.getElementById("DBNameText");
		if (inputElement == null) return;

		var tableName = inputElement.value;
		if (tableName === "") {
			alert('Please enter the name of the new person');
			return;
		}
	
		var dynamodb = this.props.dynamodb;
		if (dynamodb == null) {
			console.log('no dynamodb');
			return;
		}

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

		console.log("about to create a table");
		dynamodb.createTable(params, function(err, data) {
			if (err) {
				console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
			} else {
				console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
				this.listTables();
			}
		}.bind(this));		
	}

	renderHeader() {
		return <div>
			<input id="DBNameText" name="DBNameText" className="DB Name" type="text"/> 
			<Button bsStyle="primary" onClick={() => this.createNewTable()}> Create Table </Button>
		</div>;
	}

	render() {
		console.log('render table names');
		if (this.state.tableNames == null) {
			if (!this.state.init) {
				this.listTables();
			}
			return this.renderHeader();
		}
		else {
			console.log('about to render the names');
			return (
				<div className="Output">
					{this.renderHeader()}
					<h2>Table Names</h2>
					{this.state.tableNames.map(function(item, i) {
						return (<p key={i}>{item}</p>);
					})}
				</div>);
		}
	}
}

export default Tables;
