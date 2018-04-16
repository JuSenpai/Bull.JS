const fs = require("fs");

module.exports = {
    readDir: function(path) {
        return new Promise((resolve, reject) => {
            fs.readdir(path, function (err, filenames) {
                if (err) return reject(err);
                const contents = {};
                filenames.forEach(filename => {
                    contents[filename] = fs.readFileSync(path + filename);
                });

                resolve(contents);
            });
        });
    }
};