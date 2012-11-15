(function() {
    "use strict";

    /** Find the script-tag that loaded this javascript file */
    function findSelf() {
        var scripts = document.getElementsByTagName('script'),
            i;
        for (i = scripts.length - 1; i >= 0; i--) {
            if ((scripts[i].innerText || scripts[i].textContent).indexOf("983b5cb2-6613-43cf-a4a8-9281cab66f3b")) {
                return scripts[i];
            }
        }
        throw 'Could not find script-tag loading jshelper.js';
    }

    /** Get configration from data-* attributes in an element
     * dashes will be converted to nested objects, underscore will be camelCased
     *
     * Example:
     *
     * <script data-site-host="localhost" data-site-port="80" data-site-local_name="My site"></script>
     *
     * Will result in:
     * {
     *      site: {
     *          host: "localhost"
     *          port: "80"
     *          localName: "My site"
     *      }
     * }
     */
    function getConfig(element) {
        var config = {}, i, attribute;

        function addConfig(name, value) {
            var parts = name.split('-');

            function addData(data, parts, value) {
                var oldPart;
                if (parts.length === 1) {
                    if (data.hasOwnProperty(parts[0])) {
                        throw ["config attribute already exists", parts, value];
                    } else {
                        data[parts[0].replace(/(\_[a-z])/g, function($1) { return $1.toUpperCase().replace('_',''); })] = value;
                    }
                } else {
                    if (!data[parts[0]]) {
                        data[parts[0]] = {};
                    }
                    if (typeof(data[parts[0]]) !== 'object') {
                        throw ["Trying to add config attribute to a value", parts, value];
                    } else {
                        oldPart = parts.shift();
                        addData(data[oldPart], parts, value);
                    }
                }
            }

            parts.shift();
            addData(config, parts, value);
        }

        for (i = element.attributes.length - 1; i >= 0; i--) {
            attribute = element.attributes[i];
            if (attribute.name.indexOf('data-') === 0) {
                addConfig(attribute.name, attribute.value);
            }
        }
        config.debug = config.debug || false;
        return config;
    }

    var $$ = {
        config: getConfig(findSelf())
    };

    // If globalObjectName is set, register that global object
    if ($$.config.globalObjectName) {
        window[$$.config.globalObjectName] = $$;
    }

})();
