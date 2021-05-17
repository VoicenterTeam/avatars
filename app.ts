import express from "express";
import http from "http";

const app = express();
const port = 3000;

const server = http.createServer(app).listen(port, () => {
  console.log("Server running at port " + port);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
