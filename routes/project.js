var mongoose = require( 'mongoose' );
var Project = mongoose.model( 'Project' );
// GET Projects by UserID
exports.byUser = function (req, res) {
	console.log("Getting user projects");
	if(req.params.userid){
		Project.findByUserID( req.params.userid,
				      function(err,projects) {
						if(err) {
							//Error
							console.log(err);
							res.json({"status":"error", "error":"Error finding projects"});
						} else {
							//Project found
							if(projects) {
								console.log(projects);
								res.json(projects);
							} else  {
								console.log('No projects found for user: ' + req.params.userid);
							}
						}
					}
		);
	} else {
		//Redirect to the project page or the User page
		console.log('User id not supplied');
		res.json({"status":"error", "error":"No user id supplied"});
	}
};
// GET user creation form
exports.create = function(req, res){
	res.render('project-form', {
	title: 'Create Project',
	buttonText: "Create Project!"
});

};
// POST new user creation form
exports.doCreate = function(req, res){
	//if(req.session.loggedIn == false){
	if(!req.session.user){
		res.redirect('/login');
	} else {
	Project.create({
		projectName: req.body.ProjectName,
		createdOn : Date.now(),
		modifiedOn : Date.now(),
		createdBy : req.session.user._id
	}, function( err, project ){
		if(err){
			console.log(err);
			res.redirect('/project/new?error=true');
/*
			if(err.code===11000){
				res.redirect( '/project/new?exists=true' );
			}else{
				res.redirect('/project/new?error=true');
			}
*/
		}else{
			// Success
			console.log("Project created and saved: " + project);
			res.redirect( '/user' );
		}
	});
	}
};

exports.displayInfo = function(req,res) {	
	if(req.session.loggedIn !== "true") {
		console.log('User not logged in');
		res.redirect('/login');
	} else {
		if(req.params.id) {
			console.log('Displaying project infor for id: ' + req.params.id);
			Project.findById(req.params.id, function(err,project) {
				if(err) {
					console.log('Error finding project');
					res.redirect('/user?404=project');
				} else {
					console.log('Displaying Project : ' + project);
					res.render('project-page',{
					title: project.projectName,
					projectName: project.projectName,
					tasks: project.tasks,
					createdBy: project.createdBy,
					projectID: req.params.id
					});
				}
			});
		} else {
			console.log('Project id not specified');
			res.redirect('/user');
		}
	}
};
