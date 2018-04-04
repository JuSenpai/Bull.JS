const express = require("express");
const app = express();
const YAML = require('yamljs');

const Hyena = {
    host: null,
    port: null,

    init: function (configPath = `config\\config.yml`) {
        try {
            this.configurator.getFrameworkConfig(configPath);
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

    configurator: {
        config: null,

        getFrameworkConfig(path) {
            this.config = YAML.load(path).config;
            return this.config;
        }
    }
};

Hyena.init();
Hyena.router = require("./toolkit/routing")(app, Hyena.configurator.config);

module.exports = Hyena;
