const YAML = require("yamljs");
const Response = require("../Http/Response");
const JsonResponse = require("../Http/JsonResponse");
const TemplateResponse = require("../Http/TemplateResponse");

module.exports = function (app) {
    return {
        routes: {},
        defineRoute: function (route, controller, methods = ["GET"]) {
            const controllerClass = controller.split(":")[0];
            const controllerMethod = controller.split(":")[1];
            this.routes[route] = methods;
            methods.forEach(method => {
                app[method.toLowerCase()](route, (req, res) => {
                    controller = require(`../../../src/controller/${controllerClass}`);
                    const response = controller[`${controllerMethod}Action`](req, req.params);

                    switch(true) {
                        case response instanceof JsonResponse:
                            res.setHeader("Content-Type", "application/json");
                            res.send(JSON.stringify(response.object));
                            break;

                        case response instanceof TemplateResponse:
                            res.setHeader("Content-Type", "text/html");
                            res.render(response.path, response.params);
                            break;

                        case response instanceof Response:
                            res.setHeader("Content-Type", "text/html");
                            res.send(response.value);
                            break;

                        default:
                            let string = `${controllerClass}::${controllerMethod}Action(): this function should return a Response. "${typeof response}" returned instead.`;
                            console.error(string);
                            res.setHeader("Content-Type", "application/json");
                            res.send(JSON.stringify({code: "error", message: string}));
                    }
                });
            });
        },

        parseRoutes: function (routingFile, prefix) {
            const routes = YAML.load(routingFile).routes;
            for (let route in routes) {
                route = routes[route];
                this.defineRoute(prefix + route.path, route.controller, route.methods);
            }

            return this.routes;
        }
    };
};