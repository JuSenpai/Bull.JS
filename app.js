const express = require("express");
const app = express();
const YAML = require('yamljs');

const Bull = {
    serializer: YAML,
    init: function () {
        try {
            this.router.parseRoutes();
        } catch(e) {
            return;
        }

        app.listen(3000, "0.0.0.0", () => console.log("Server listening..."));
    },

    router: {
        routes: {},
        defineRoute: function (route, controller, methods = ["GET"]) {
            const controllerClass = controller.split(":")[0];
            const controllerMethod = controller.split(":")[1];
            this.routes[route] = methods;
            methods.forEach(method => {
                app[method.toLowerCase()](route, (req, res) => {
                    controller = require(`/src/controller/${controllerClass}`);
                    controller[`${controllerMethod}`](req, res, req.params);
                });
            });
        },

        parseRoutes: function () {
            const routes = Bull.serializer.load(`${Bull.root}\\config\\routing.yml`).routes;
            for(let route in routes) {
                route = routes[route];
                this.defineRoute(route.path, route.controller, route.methods);
            }

            return this.routes;
        }
    }
};

Bull.init();

module.exports = Bull;
