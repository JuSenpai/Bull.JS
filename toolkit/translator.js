const system = require("fs");
const YAML = require("yamljs");

module.exports = function (config) {
    return {
        translations: {},
        load: function () {
            if (!config.translations.root) {
                console.error("Apparently, you enabled translations but did not set a root folder. Assuming `config/translations`.");
                config.translations.root = "config/translations";
            }
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
            if (!(locale in this.translations)) {
                throw `Locale "${locale}" is not defined. Please create a folder with the locale name under ${config.translations.root}.`;
            } else {
                let translation = this.translations[locale][mask];
                for (let param in params) {
                    translation = translation.replace(new RegExp(`:${param}`), params[param]);
                }

                return translation;
            }
        }
    };
};