const TemplateResponse = require("./TemplateResponse");
const Response = require("./Response");
const JsonResponse = require("./JsonResponse");

class Controller {
    render(path, params) {
        return new TemplateResponse(path, params);
    }

    send(html) {
        return new Response(html);
    }

    json(object) {
        return new JsonResponse(object);
    }
}

module.exports = new Controller();