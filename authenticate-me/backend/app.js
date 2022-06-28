const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production'; //if the environment is in production or not

const app = express();

// middleware for logging information about requests and responses:
app.use(morgan('dev'));
// middleware for parsing cookies
app.use(cookieParser());
app.use(express.json());

/** Only allow CORS in development using the cors middleware because the React frontend will be served from a different server than the Express server. CORS isn't needed in production since all of our React and Express resources will come from the same origin. */

if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app,
// React is generally safe at mitigating XSS
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

/** The csurf middleware will add a _csrf cookie that is HTTP-only (can't be read by JavaScript) to any server response. It also adds a method on all requests (req.csrfToken) that will be set to another cookie (XSRF-TOKEN) later on. These two cookies work together to provide CSRF (Cross-Site Request Forgery) protection for your application. The XSRF-TOKEN cookie value needs to be sent in the header of any request with all HTTP verbs besides GET. This header will be used to validate the _csrf cookie to confirm that the request comes from your site and not an unauthorized site. */

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && 'Lax',
      httpOnly: true
    }
  })
)

const routes = require('./routes')

app.use(routes);

module.exports = app;
