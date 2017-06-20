// App
const appRouter = function(app) {
    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '../../public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
    /* Prevent from CORS problems in local ENV */
    app.all('/*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
        console.log('Allow CORS');
    });
}
// User
const userRouter = require('./user-router');

module.exports = appRouter;
module.exports = userRouter;