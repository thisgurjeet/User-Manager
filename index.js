const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Access static files from public
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function (req, res) {
    fs.readdir('./files', function (err, files) {
       
        res.render("index", { files: files });  // sending files data to index.ejs
    });
});

app.post('/create', function (req, res) {
    const filePath = `./files/${req.body.title.split(' ').join('')}.txt`;
    fs.writeFile(filePath, req.body.details, function (err) {
     
        res.redirect('/');  // Redirect to the home page
    });
});

app.get('/file/:filename', function (req, res) {
   fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, fileData){
    res.render('show', {filename: req.params.filename, fileData: fileData});
   });
});


app.get('/edit/:filename', function (req, res) {
   res.render('edit', {filename: req.params.filename});
 });

 app.post('edit', function(req, res){
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function(err){
        res.redirect("/");
    })
 });

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
