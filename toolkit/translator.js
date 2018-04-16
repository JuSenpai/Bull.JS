const system = require("./system");
const YAML = require("yamljs");

module.exports = function(config) {
    return {
        translations: {},
        load: function (locale) {
            system.readDir(config.translations.root + "/" + locale + "/")
                .then(function (contents) {
                    let translations = {};
                    for (let file in contents) {
                        translations = Object.assign({}, translations, YAML.parse(contents[file].toString()).translations);
                    }
                    return translations;
                })
                .then(translations => {
                    this.translations[locale] = translations;
                });
        },

        translate: function (mask, locale = "en", params = {}) {
            let translation = this.translations[locale][mask];
            for(let param in params) {
                translation = translation.replace(new RegExp(`:${param}`), params[param]);
            }

            return translation;
        }
    };
};