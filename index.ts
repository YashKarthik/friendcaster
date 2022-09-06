import path from 'path';
import express from 'express';
import favicon from 'serve-favicon';
import { createImage } from './src/final';

const app = express();
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.static("public"))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.get("/", (req, res) => {
  res.render('pages/index');
})

app.get("/faq", (_req, res) => {
  res.render('pages/faq');
})

app.get("/circle/:username", (req, res, next) => {
  let username = req.params.username;
  if (username[0] == '@') username = username.slice(1,);

  createImage(username)
    .then(e => {
      setTimeout(() => (res.render('pages/circle'), 1))
    }).catch(next)
});

// Handle 404
app.use(function(_req, res) {
  res.status(404);
  res.redirect('/');
});

// Handle 500
app.use(function(_req, res,) {
  res.status(500).send('500: Internal Server Error');
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
