const YAML = require("yamljs");

module.exports = function (Bull) {
    return {
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

        parseRoutes: function (routingFile) {
            const routes = YAML.load(routingFile).routes;
            for (let route in routes) {
                route = routes[route];
                this.defineRoute(route.path, route.controller, route.methods);
            }

            return this.routes;
        }
    };
}