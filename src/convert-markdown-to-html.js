
var MarkdownIt = require('markdown-it');
var fs = require('fs');
var path = require('path');

var md = new MarkdownIt();

var markdownDirectoryNameName = "wiki_raw";
var buildDirectoryName = 'build';

var enumerateMarkdownFiles = function (dir, done, onFolder) {
    let results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function (file) {
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    onFolder(file);
                    enumerateMarkdownFiles(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    }, onFolder);

                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }                
            });
        });
    });
};

function getOutputPathSafe(pathName) {
    var outputpath = pathName
    .replace(markdownDirectoryNameName, buildDirectoryName)
    .replace('.attachments', 'attachments');
    return outputpath;
}

function onFolderFound(fullName) {
    if ((fullName.indexOf('.git') === -1)) {
        var outputpath = getOutputPathSafe(fullName);
        if (!fs.existsSync(outputpath)) {
            var parts = outputpath.split('/');
            var incrBuildPath = '';
            parts.forEach(path => {
                incrBuildPath = incrBuildPath + '/' + path;
                if (!fs.existsSync(incrBuildPath)) {
                    fs.mkdirSync(incrBuildPath);
                }
            });
            
        }
    }
  
}

enumerateMarkdownFiles('./' + markdownDirectoryNameName, function (err, files) {
    if (!err) {
        files.forEach(filePath => {
            
            filePath = './' + filePath.substr(filePath.indexOf(markdownDirectoryNameName))
            if (filePath.endsWith('.md')) {
                var outputpath = getOutputPathSafe(filePath.substr(0, filePath.length - 2) + 'html') ;
                fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
                    if (!err) {
                        var result = md.render(data);
                        fs.writeFile(outputpath,
                            result, function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                    } else {
                        console.log(err);
                    }
                });
            } else {
                if ((filePath.indexOf('.git') === -1)) {
                    var outputpath = getOutputPathSafe(filePath);
                    fs.createReadStream(filePath).pipe(fs.createWriteStream(outputpath));
                }
                
            }
            
        });
    }
}, onFolderFound);
