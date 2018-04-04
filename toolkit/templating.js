const fs = require("fs");
module.exports = function (filepath, options, callback) {
    fs.readFile(filepath, (err, content) => {
        if (err) return callback(err);

        let renderedContent = parseHyenaContent(content);
        return callback(null, renderedContent);
    });
};


function parseHyenaContent(content) {
    
}

const HyenaSkeleton = {
    block: function (blockName, content) {

    }
};