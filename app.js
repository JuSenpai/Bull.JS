const express = require("express");
const app = express();
const YAML = require('yamljs');

const Hyena = {
    host: null,
    port: null,

    init: function (configPath = `config\\config.yml`) {
        try {
            this.configurator.getFrameworkConfig(configPath);
            if (this.configurator.config.translations.enabled) {
                this.translator = require("./toolkit/translator")(this.configurator.config);
                this.translator.load();
            }
            this.router = require("./toolkit/routing")(app, this.configurator.config);
            this.start();
        } catch(e) {
            console.error(e.message);
        }
    },

    start: function () {
        let config = this.configurator.config;
        try {
            if (config.templating) {
                app.set('views', config.templating.views.root);
                app.set('view engine', config.templating.engine.toLowerCase());
            }

            (config.includes.routing || [{path: `config\\routing.yml`}]).forEach(routingFile => {
                this.router.parseRoutes(routingFile.path, routingFile.prefix || "");
            });
        } catch (e) {
            console.error(e.message);
        }

        if (!config.port) {
            console.error("%root%/config/config.yml does not contain the port setting.");
        } else {
            app.listen(config.port, config.host || "0.0.0.0", () => console.log(`Server started on ${config.host || "0.0.0.0"}:${config.port}`));
        }
    },

    router: null,
    translator: null,

    configurator: {
        config: null,

        getFrameworkConfig(path) {
            this.config = YAML.load(path).config;
            return this.config;
        }
    }
};

require("./toolkit/twig");

global.Hyena = {
    getConfig: function () {
        return Hyena.configurator.config;
    },

    getTranslator: function () {
        return Hyena.translator;
    }
};

module.exports = Hyena;
