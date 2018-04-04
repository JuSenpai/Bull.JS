# HyenaJS
HyenaJS is a web framework that works over Express and is **highly** inspired by PHP's Symfony.

### Installation
---
To install HyenaJS you only have to run:
```
npm install hyenajs
```

### Usage
---
After installation, you (expectedly) want to use the framework. How to do so?
```javascript
const Hyena = require("hyenajs");

// ... additional code 

Hyena.start();  // run the app
```


### Configuration
---
The framework has a configuration file, located by default under the `config/config.yml` file.

However, you may change this file if you wish, simply by passing an argument to the **start()** function like below:

```javascript
Hyena.start("/path/to/file.yml");
```

An example of what this file **should** contain:
```
config:
    port: 3001

    templating:
        engine: twig 		# also works with jade, from what i've tested
        views:
            root: src/template		# my personal choice; customize as you wish
        globals:
            hello: world	# globals sent to the templates

    includes:
        routing: # if nothing is specified here, it looks for config/routing.yml file
            - { path: config/routing.yml, prefix: /hello }	# prefix is optional
```

### Routing
---
As you have seen in the previous section, there's a `routing` object. It can be useful for defining routing within the framework. If you don't have the `routing` object in the config file, it will automatically look for `config/routing.yml` file. If that's not found, the framework will throw an error.

An example of a routing file:

```
routes:
    index:
        path: /index
        controller: Hello:main	# mainAction method inside the Hello class
        methods: [GET, POST]	# defaults to [GET] if not mentioned
	
	user.id:
		path: /user/:id
		controller: User:getById	# references method getByIdAction inside User class
		# defaults to [GET] method
```


### Controller
---
After walking through the routing, let's now see a controller:

```javascript
const Controller = require("hyenajs/Http/Controller");

class Hello extends Controller {
    mainAction(req, params) {
        return this.render("index.twig", {
            text: "hello world!"
        });
    }
}

module.exports = new Hello();
```

The response is treated and sent behind the scenes, so you don't have to worry with that. However, you may temper with the type of return types from an action. There are 3 main methods of returning a response:

1. using **`this.render(filename, template_params)`** function call (you must have a templating engine specified otherwise an error will be returned)
2. using **`this.send(html)`** function call - will simply send a HTML response containing whatever string you pass
3. using **`this.json(object)`** function call - this will use the `Content-Type: application/json` header and pass your object as a JSON response

The **req** parameter represents the request;
The **params** parameter contains the parameters passed via url or sent from a redirect. (yes, you may pass parameters through redirects).

**Returning anything else but one of the three function calls will result in an error.**





















