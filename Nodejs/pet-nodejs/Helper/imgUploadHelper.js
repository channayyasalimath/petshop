var helper = {};
var multer  = require('multer');
var path = require('path');



var storage =   multer.diskStorage({
  destination : function (req, file, callback) {
 // var sess = req.app.get('sess');
 // console.log("in storage  "+" the user session : " + sess.uid);
  console.log("file in dest : "+JSON.stringify(file));
  
     var type = file.mimetype.split('/');
     if(type[0] == "image")
       callback(null, path.join(__dirname,'../public/assets'));
       //callback(null, __dirname+'/public/foomoz_images/cater_images');
    else if(type[0] == "text" || type[0] == "application")
       callback(null, __dirname+'/public/assets');
     else if(type[0] == "audio")
      callback(null, __dirname+'/public/assets');
     else if(type[0] == "video")
       callback(null, __dirname+'/public/assets');	
 
  else
    res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
  },
  filename: function (req, file, callback) {
	  // var type = file.mimetype.split('/');
	  
    var name = file.originalname.split('.');
	console.log("name is : "+file.originalname);
	ext = name[name.length-1];
        callback(null, file.fieldname + '-' + Date.now()+`.${ext}`);
	
	// if(name[0] == "image")
	// {
	// 	var timeStamp = Math.floor(Math.random() * 20);
 //      var pictureFile = "CAMIMG_" + timeStamp +"."+ext;
	//     console.log("file isss: "+pictureFile);
 //        callback(null, file.fieldname + '-' + Date.now()+ext);
		
	// }	
	// else
 //    {
	// 	pictureFile = file.originalname;
 //       callback(null, file.fieldname + '-' + Date.now()+ext);

	// }
	//console.log("the extension is: "+type[0]);
	
	//var timeStamp = Math.floor(Math.random() * 20);
    //var pictureFile = "CAMIMG_" + timeStamp +"."+ext;
	//console.log("file isss: "+pictureFile);
    
  }
});
//var upload = multer({ dest : './public/uploads/images'});
helper.upload = multer({ storage : storage}).any();
console.log(storage);
//console.log(helper.upload);



module.exports = helper;