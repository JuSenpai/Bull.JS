const express = require("express");
const app = express();
const YAML = require('yamljs');

const Hyena = {
    host: null,
    port: null,

    start: function (configPath = `config\\config.yml`) {
        let config = {};
        try {
            config = this.configurator.getFrameworkConfig(configPath);
            if (config.templating) {
                if (config.templating.engine.toLowerCase() === "hyena") {
                    app.engine('hyena', require("./toolkit/templating"));
                }
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

    router: require("./toolkit/routing")(app, this.configurator.config),

    configurator: {
        config: null,

        getFrameworkConfig(path) {
            this.config = YAML.load(path).config;
            return this.config;
        }
    }
};

module.exports = Hyena;
