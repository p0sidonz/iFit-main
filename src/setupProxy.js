const proxy = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
        proxy("rest/",{
            target: "https://platform.fatsecret.com/",
            changeOrigin: true
        })
    )
}