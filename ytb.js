const fetch = require("node-fetch");

const getUrl = (id) => {
  const key =  "AIzaSyCewOz3ojxPLn2ddwmTkeoutd5ORiLA7g8";
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${key}&part=snippet,statistics&fields=items(snippet)`;
  fetch(url).then((res) => res.json()).then(data => console.log(data))
}

