(function(rootScope) {
    "use strict";

    var $$,
    consoleMethods = [
        "memory",
        "profiles",
        "debug",
        "error",
        "info",
        "log",
        "warn",
        "dir",
        "dirxml",
        "trace",
        "assert",
        "count",
        "markTimeline",
        "profile",
        "profileEnd",
        "time",
        "timeEnd",
        "timeStamp",
        "group",
        "groupCollapsed",
        "groupEnd"],
        i,
        l;

    /** Get configuration from data-* attributes in an element.
     *
     * dashes will be converted to nested objects, underscore will be
     * camelCased.
     *
     * 'debug' will be set to false if it's missing or is set to one of '', '0'.
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
    function getConfigFromElement(element) {
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
        config.debug = config.hasOwnProperty('debug') && config.debug !== '' && config.debug !== '0' ? true : false;
        return config;
    }

    /**
     * No-op function
     */
    function noop() {
    }

    /** Our object */
    $$ = {
    };

    /** Setup console based on config
     *
     * If 'console' is missing all console methods will be emulated with 'noop'
     * If config.debug is set to '0' all console methods will be replaced with 'noop'.
     */
    function setupConsole() {
        if (typeof(console) === 'undefined') {
            // Emulate console
            console = {};
            for (i = 0, l = consoleMethods.length; i < l; i++) {
                console[consoleMethods[i]] = noop;
            }
        } else if (!this.config.debug) {
            // Silence console
            for (i = 0, l = consoleMethods.length; i < l; i++) {
                console[consoleMethods[i]] = noop;
            }
        }
    }

    // Assign functions
    $$.getConfigFromElement = getConfigFromElement;
    $$.setupConsole = setupConsole;
    $$.configFromElementId = function(id) {
        this.config = this.getConfigFromElement(document.getElementById(id));
    };
    $$.setupFromElementId = function(id) {
        this.configFromElementId(id);
        this.setupConsole();
    };

    // Assign to JsHelper
    rootScope.JsHelper = $$;

})(window);
