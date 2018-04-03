const express = require("express");
const app = express();
const YAML = require('yamljs');

const Bull = {
    host: null,
    port: null,
    serializer: YAML,
    start: function () {
        let config = {};
        try {
            this.router.parseRoutes();
            config = this.configurator.getFrameworkConfig();
        } catch(e) {
            console.log(e);
        }

        if (!config.port) {
            console.error("%root%/config/config.yml does not contain the port setting.");
        } else {
            app.listen(config.port, config.host || "0.0.0.0", () => console.log(`Server started on ${config.host}:${config.port}`));
        }
    },

    router: {
        routes: {},
        defineRoute: function (route, controller, methods = ["GET"]) {
            const controllerClass = controller.split(":")[0];
            const controllerMethod = controller.split(":")[1];
            this.routes[route] = methods;
            methods.forEach(method => {
                app[method.toLowerCase()](route, (req, res) => {
                    controller = require(`../../src/controller/${controllerClass}`);
                    res.send(controller[`${controllerMethod}Action`](req, req.params));
                });
            });
        },

        parseRoutes: function () {
            const routes = Bull.serializer.load(`config\\routing.yml`).routes;
            for(let route in routes) {
                route = routes[route];
                this.defineRoute(route.path, route.controller, route.methods);
            }

            return this.routes;
        }
    },

    configurator: {
        config: null,

        getFrameworkConfig() {
            this.config = Bull.serializer.load(`config\\config.yml`).config;
            return this.config;
        }
    }
};

module.exports = Bull;
