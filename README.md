jshelper
========

Basic javascript helpers for browsers.

A very small collection of functions that reads configuration from a specific HTML-element and parses that into a nested object with camelCased attributes. After that the console is set up based on the debug flag in config.

getConfigFromElement example
----------------------------

The HTML:

    <script id="config" data-site-host="localhost" data-site-port="80" data-site-local_name="My site"></script>
    <script>
        JsHelper.setupFromElementId("config");
        console.log(JsHelper.config);
    </script>


Will print:

    {
        site: {
            host: "localhost"
            port: "80"
            localName: "My site"
        }
    }

Console behaviour
-----------------

If data-debug is set to something else than '' or '0' console.log will behave as usual. If it's not set or set to '' or '0' all console methods will be disabled. If the console object is missing all it's methods will be emulated with a no-op function. The console methods are set in 'consoleMethods'.
