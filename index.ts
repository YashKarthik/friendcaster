import express from 'express';
import { createImage } from './src/final';
import path from 'path';

const app = express();
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.render('pages/index');
})

app.get("/circle/:username", (req, res) => {
  let username = req.params.username;
  res.render('pages/circle');

  //createImage(username)
  //  .then(e => {
  //    res.render('pages/circle');
  //  })
});

app.listen(3001, () => {
  console.log(`Server listening on 3001`);
});
