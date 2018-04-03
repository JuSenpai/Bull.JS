const express = require("express");
const app = express();
const YAML = require('yamljs');

const Bull = {
    host: null,
    port: null,
    serializer: YAML,
    start: function (configPath) {
        let config = {};
        try {
            config = this.configurator.getFrameworkConfig(configPath || `config\\config.yml`);
            (config.includes.routing || [`config\\routing.yml`]).forEach(routingFile => {
                this.router.parseRoutes(routingFile);
            });
        } catch(e) {
            console.error(e.message);
        }

        if (!config.port) {
            console.error("%root%/config/config.yml does not contain the port setting.");
        } else {
            app.listen(config.port, config.host || "0.0.0.0", () => console.log(`Server started on ${config.host || "0.0.0.0"}:${config.port}`));
        }
    },

    router: require("./toolkit/routing")(this),

    configurator: {
        config: null,

        getFrameworkConfig(path) {
            this.config = Bull.serializer.load(path).config;
            return this.config;
        }
    }
};

module.exports = Bull;
