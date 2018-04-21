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

Hyena.init();  // run the app
```


### Configuration
---
The framework has a configuration file, located by default under the `config/config.yml` file.

However, you may change this file if you wish, simply by passing an argument to the **init()** function like below:

```javascript
Hyena.init("/path/to/file.yml");
```

An example of what this file **should** contain:
```
config:
    port: 3001

    templating:
        # also works with jade (minimally as we encourage the usage of twig), from what i've tested
        engine: twig 		
        views:
            # my personal choice; customize as you wish
            root: src/template	
        globals:
            # global template variables
            hello: world	

    includes:
        routing: 
            # if nothing is specified here, it looks for config/routing.yml file
            # prefix is optional
            - { path: config/routing.yml, prefix: /hello }	
```

### Routing
---
As you have seen in the previous section, there's a `routing` object. It can be useful for defining routing within the framework. If you don't have the `routing` object in the config file, it will automatically look for `config/routing.yml` file. If that's not found, the framework will throw an error.

An example of a routing file:

```
routes:
    index:
        path: /index
        # mainAction method inside the Hello class
        controller: Hello:main
        # defaults to [GET] if not mentioned
        methods: [GET, POST]	
	
	user.id:
		path: /user/:id
		# references method getByIdAction inside User class
		controller: User:getById
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


### Translations
---

If your web application is supposed to handle multiple languages, you may want to use this feature. HyenaJS comes with a translation system included.

To enable this feature you have to do one thing:
* add the following to your **config.yml** under the **config** key:
	
	
```
translations:
	enabled: true
	# root can be any directory; required otherwise translations will be disabled
	root: config/translations
```

To specify a global locale to the app you can add the **locale** key **directly** unde the **config** key.

```
config:
	locale: en
```

#### How does it work?
The translation system looks inside the root directory specified and interprets every child directory as a **locale.** Basically, if you set the app locale to **apple** and you have an **apple/** directory inside your translations root, it will be perfectly valid.
The translation system will then look inside **EVERY** translation folder and parse every **.yml** file it encounters. The **.yml** files here should **key-value** pairs containing translations.

**Example of TranslationFile.yml**

```
# config/translations/en/TranslationFile.yml
translations:
	hello_message: Hello, world!
	hello_user: Hello, :user!
```

Yes, it accepts parameters just like in the above example. When translating that specific message, you can specify the **user** attribute in order to replace it. If none is specified, the **:user** text will be shown.

#### Using translations inside templates
This can be easily achieved using the custom **twig** filter called **translate**.

```
<h1>{{ 'hello_message'|translate }}</h1>
```

This will render the message having the **hello_message** key **in the globally specified locale.**

You can, however, override this and render the message using a different locale by passing a parameter to the filter.
```
<h1>{{ 'hello_message'|translate('fr') }}</h1>
```

This will render the **hello_message** in **french** (if the **fr** folder exists under the translations root).

You can also pass parameters to the translation if the message requires it:

```
<h1>{{ 'hello_user'|translate({user: 'JuSenpai'}) }}</h1>
```

The combination of the above actions works as well:
```
<h1>{{ 'hello_user'|translate({user: 'JuSenpai'}, 'fr') }}</h1>
```

This will pass the parameters to the message and also render it in the desired locale.

#### An important note: This feature is currently only supported in Twig templating language (sorry jade fans)















