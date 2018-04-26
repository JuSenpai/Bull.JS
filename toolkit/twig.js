const Twig = require("twig");

Twig.extend(twig => {
    twig.filter.extend('translate', (value, params) => {
        if (Hyena.getConfig().translations) {
            try {
                return Hyena.getTranslator()
                    .translate(
                        value,
                        params[1] || Hyena.getConfig().translations.locale || "en", params[0]);
            } catch (ex) {
                console.error(ex);
                return null;
            }
        } else console.error("Translations are not enabled.")
    });
});

module.exports = Twig;