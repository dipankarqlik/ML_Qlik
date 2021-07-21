const express = require("express");
const app = express();
const fs = require("fs");
const config = require("../config/config");
const token = require("../token/token");
var bodyParser = require("body-parser");

app.use(express.static(__dirname));
//console.log(token.getKey());

app.use(bodyParser.json());

app.get("/mashup", (req, res) => {
  let mashFile = fs.readFileSync("./src/index.html", "utf8");
  res.write(mashFile);
  res.end();
});

app.get("/config", (req, res) => {
  res.json(config);
  res.end();
});

app.get("/token", (req, res) => {
  const ip = req.connection.remoteAddress;
  const genT = token.generate(ip, config.tenantDomain);
  res.json({ token: genT });
});

app.get("/theme/:name", (req, res) => {
  let themeFile = fs.readFileSync(`./themes/${req.params.name}.json`);
  res.json({ theme: JSON.parse(themeFile) });
  res.end();
});

app.post("/wordembed", (req, res) => {
  var val = req.body.hi;

  const w2v = require("word2vec");
  w2v.loadModel("vectors.txt", (error, model) => {
    console.log("SIZE: ", model.size);
    console.log("WORDS: ", model.words);
    var sim = model.mostSimilar(val, 5);
    res.send(sim);
  });
});

app.get("/data", (req, res) => {
  const path = require("path");
  const csv = require("fast-csv");
  const data = [];
  fs.createReadStream(path.resolve(__dirname, "../pca_words.csv"))
    .pipe(csv.parse({ headers: true }))
    .on("error", error => console.error(error))
    .on("data", row =>
      //console.log(row)
      data.push(row)
    )
    .on("end", () => {
      res.send(data);
    });
});
//create a server object:
app.listen(8080); //the server object listens on port 8080
