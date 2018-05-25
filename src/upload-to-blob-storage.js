
const fs = require('fs');
const path = require('path');
const storage = require('azure-storage');

const blobService = storage.createBlobService();
var uploadFolder = "rawwiki";
var buildDirectoryName = 'build';
var pending = true;

const createContainer = (containerName) => {
    return new Promise((resolve, reject) => {
        blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Container '${containerName}' created` });
            }
        });
    });
};

const upload = (containerName, blobName, sourceFilePath) => {
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromLocalFile(containerName, blobName, sourceFilePath, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Upload of '${blobName}' complete` });
            }
        });
    });
};


const deleteBlock = (blobName) => {
    return new Promise((resolve, reject) => {
        blobService.deleteBlobIfExists(containerName, blobName, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Block blob '${blobName}' deleted` });
            }
        });
    });
};



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


function uploadFile(name, filePath) {
    console.log('Uploading: ' + filePath);
    upload(uploadFolder, name, filePath).then(() => {
        pending = false;
    });
}


createContainer(uploadFolder).then(() => {
    var all = [];
    enumerateMarkdownFiles('./' + buildDirectoryName, function (err, files) {
        if (!err) {
            files.forEach(filePath => {
                var name = filePath.substr(filePath.indexOf(buildDirectoryName) + buildDirectoryName.length + 1);


                all.push({
                    name: name,
                    filePath: filePath
                });
            });
        }
    }, function () { });


    var waitFunc = function () {
        if (pending === false) {
            setTimeout(doFunc, 100);
        } else {
            setTimeout(waitFunc, 100);
        }
    }


    var doFunc = function () {
        if (all.length > 0) {
            var data = all[0];
            all.splice(0, 1);
            pending = true;
            uploadFile(data.name, data.filePath);
            setTimeout(waitFunc, 100);
        }
    };

    setTimeout(doFunc, 100);

});

