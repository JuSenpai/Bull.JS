const system = require("./system");
const YAML = require("yamljs");

module.exports = function(config) {
    return {
        load: function (locale) {
            system.readDir(config.translations.root + "/" + locale)
                .then(function* (contents) {
                    for (let file in contents) {
                        yield YAML.parse(contents[file]);
                    }
                })
                .then(translations => {
                    console.log(translations);
                });
        },

        translate: function (mask, locale = "en", params = {}) {

        }
    };
};