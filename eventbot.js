var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var app = express();
var fs = require('file-system');

app.use(bodyParser.json());
app.use(express.static("public"));

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "public/images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: Storage
}).array("imgUploader", 10); //Field name and max count


app.get("/", function(req, res) {
    //res.sendFile(__dirname + "/index.html");
    var pictures = [];  
    fs.recurseSync("public/images/",
                   ['**/*.JPG', '**/*.PNG', '**/*.JPEG', '**/*.jpg', '**/*.png', '**/*.jpeg'],
                   function(filepath, relative, filename) {
                       console.log(filename);
                       pictures.push("/images/" + filename);
                   });
    res.render("index.ejs", {pictures: pictures});

});
app.post("/api/upload", function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        else {
        return res.end("File Uploaded Successfully!");
        res.redirect("/");
        }
    });
});

 app.listen(8090, function(a) {
    console.log("Listening to port 8090");
});
