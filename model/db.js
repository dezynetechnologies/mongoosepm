// Bring Mongoose into the project
var mongoose = require( 'mongoose' );
// Build the connection string
var dbURI = 'mongodb://localhost/MongoosePM';
// Create the database connection
mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {
console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
console.log('Mongoose disconnected');
});
process.on('SIGINT', function() {
mongoose.connection.close(function () {
console.log('Mongoose disconnected through app termination');
process.exit(0);
});
});
/* ********************************************
USER SCHEMA
******************************************** */
var userSchema = new mongoose.Schema({
name: String,
email: {type: String, unique:true},
createdOn: { type: Date, default: Date.now },
modifiedOn: Date,
lastLogin: Date
});
// Build the User model
mongoose.model( 'User', userSchema );

/* ********************************************
PROJECT SCHEMA
******************************************** */
var projectSchema = new mongoose.Schema({
projectName: String,
createdOn: { type: Date, default: Date.now },
modifiedOn: Date,
createdBy: String,
contributors: String,
tasks: String
});

projectSchema.statics.findByUserID = function (userid, callback) {
this.find(
{ createdBy: userid },
'_id projectName',
{sort: 'modifiedOn'},
callback);
};

// Build the Project model
mongoose.model( 'Project', projectSchema );

