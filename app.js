var express = require("express");
var mongoose = require("mongoose"); //Throught this module we can work with mongodb database
var bodyParser = require("body-parser") //Throught this module we can retrieve data which will be sent through input fields

var app = express();
var connUrl = "mongodb+srv://datos-blog:datosblog123@cluster0.pfjn6.mongodb.net/customers?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));

app.set("view engine", "pug"); // we will use pug view engine
app.set("views", "./views"); // our templates will be in views folder, which will be rendered on server 


var connect = mongoose.connect(connUrl, {useUnifiedTopology : true, useNewUrlParser : true}, function(err) {
	if(err) throw err;
	console.log("Database connected!");
});

var CustomersSchema = mongoose.Schema({
	name : {
		type : String, // field type is string
		required : true // field is required to be filled
	},
	lastname : {
		type : String, // field type is string
		required : true // field is required to be filled
	},
	email : {
		type : String, // field type is string
		required : true // field is required to be filled
	},
	password : {
		type: String, // field type is string
		required : true // field is required to be filled
	}
}, {timestamps: true});

// via this code we are creating "Customers" collection in mongodb
var Customer_Model = mongoose.model("Customers", CustomersSchema);

//this is route which represents html page to insert data
app.get("/", function(request, response) {
	response.render("index");
});

//this route creates customers
app.post("/create", function(request, response) {
	var newCustomer = new Customer_Model({
		name : request.body.name,
		lastname : request.body.lastname,
		email : request.body.email,
		password : request.body.password
	}); // creating new model to insert datas on it

	newCustomer.save().then(function() {
		response.send("User created");
	}).catch(function() {
		response.send("User not created");
	});
});

//this route retrieves customer details
app.get("/users", function(request, response) {
	Customer_Model.find().then(function(data) {
		response.json(data);
	}).catch(function() {
		response.send("<h3>Error!</h3>");
	})
});

//Throught this route we can retrieve any customer details using specified "id"
app.get("/users/:id", function(request, response) {
	Customer_Model.findById(request.params.id).then(function(data) {
		response.json(data);
	}).catch(function() {
		response.send("<h3>Error!</h3>");
	});
});

//throught this route we can retrieve customers details on rendered page
app.get("/details", function(request, response) {
	Customer_Model.find(function(err, data) {
		response.render("details", {users : data});
		console.log(data);
	});
});

//Throught this route we can delete specified customer in database
app.get("/delete/:id", function(request, response) {
	Customer_Model.findByIdAndDelete(request.params.id).then(function() {
		response.send("Deleted!");
	}).catch(function(error) {
		response.send(error);
	});
});

//Throught this route will be rendered customer updater page
app.get("/update/:id", function(request, response) {
	Customer_Model.findById(request.params.id).then(function(data) {
		response.render("update", {user : data});
	}).catch(function(err) {
		response.send(err);
	});
});

//throught this route we can update specified customer details
app.post("/update/:id", function(request, response) {
	// these are fields to update customers details
	let updates = {
		name : request.body.name,
		lastname : request.body.lastname,
		email : request.body.email,
		password : request.body.password
	};

	// we are finding specified user by id and update it
	Customer_Model.findByIdAndUpdate({_id : request.params.id}, updates).then(function() {
		response.send("Updated!");
	}).catch(function(err) { // if errors detected will be printed out on the server
		response.send(err);
	})
});

app.listen(process.env.PORT | 3000, function(err) {
	if(err) throw err;
	console.log("Server is ready...");
});