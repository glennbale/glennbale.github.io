import express from "express";
import fetch from "node-fetch";
const planets = (await import("npm-solarsystem")).default;

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  // Random image
  let apiKey =
    "7756a1e81f817c186cf57294e1c19b37b49c54b8f34e7c499ee0ce5cd86cd16e";
  let url = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&featured=true&query=solar-system`;
  let response = await fetch(url);
  let data = await response.json();
  let randomImage = data.urls.full;

  // Nasa POD
  let nasaUrl =
    "https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD";
  let nasaResponse = await fetch(nasaUrl);
  let nasaData = await nasaResponse.json();
  let nasaImage = nasaData.url;
  let nasaDescription = nasaData.explanation;

  // render
  res.render("index", {
    image: randomImage,
    nasaImage,
    nasaDescription,
  });
});

app.get("/planet", (req, res) => {
  let planetName = req.query.planetName;
  let planetInfo = planets[`get${planetName}`]();
  res.render("planet", { planetInfo, planetName });
});

// app.get("/earth", (req, res) => {
//   let planetEarth = planets.getEarth();
//   console.log(planetEarth);
//   res.render("earth", { planetEarth });
// });

// app.get("/mars", (req, res) => {
//   let planetMars = planets.getMars();
//   console.log(planetMars);
//   res.render("mars", { planetMars });
// });

app.listen(3000, () => {
  console.log("server started");
});
