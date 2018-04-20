const system = require("fs");
const YAML = require("yamljs");

module.exports = function (config) {
    return {
        translations: {},
        load: function () {
            const folders = system.readdirSync(config.translations.root);
            folders.forEach(folder => {
                system.readdir(config.translations.root + "/" + folder, (err, contents) => {
                    contents.forEach(file => {
                        let translations = {};
                        for (let file in contents) {
                            const path = config.translations.root + "/" + folder + "/" + contents[file];
                            translations = Object.assign({}, translations, YAML.parse(system.readFileSync(path).toString()).translations);
                        }

                        this.translations[folder] = translations;
                    });
                });
            });
        },

        translate: function (mask, locale, params = {}) {
            let translation = this.translations[locale][mask];
            for (let param in params) {
                translation = translation.replace(new RegExp(`:${param}`), params[param]);
            }

            return translation;
        }
    };
};