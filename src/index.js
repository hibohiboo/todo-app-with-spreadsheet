
const { Elm } = require("./Main.elm");
console.log('elm')
Elm.Main.init({
  node: document.getElementById("app"),
  flags: {},
});
