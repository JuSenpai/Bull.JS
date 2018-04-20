const Twig = require("twig");

Twig.extend(twig => {
    twig.filter.extend('translate', (value, params) => {
        try {
            return Hyena.getTranslator()
                .translate(
                    value,
                    params[1] || Hyena.getConfig().locale || "en", params[0]);
        } catch(ex) {
            console.error(ex.message);
            return null;
        }
    });
});

module.exports = Twig;