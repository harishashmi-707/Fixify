import app from '../app.js';

// Vercel Node runtime expects a default export that is a request handler.
// The Express `app` is itself a handler function, so forward requests to it.
export default function handler(req, res) {
  return app(req, res);
}
