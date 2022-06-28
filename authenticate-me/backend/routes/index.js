const express = require('express');
const router = express.Router();

/**
  In this test route, you are setting a cookie on the response with the name of XSRF-TOKEN to the value of the req.csrfToken method's return. Then, you are sending the text, Hello World! as the response's body.

  Add the routes to the Express application by importing with the other imports in backend/app.js and connecting the exported router to app after all the middlewares.
 */

router.get('/hello/world', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World')
})

module.exports = router;
