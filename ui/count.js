let countries = require("./public/countries");

console.log("countries.length");
console.log(countries.objects.world.geometries.length);

// let cleaned = countries.features.map((plek) => {
//   return { country: plek.N, isoCode: plek.I };
// });

let cleaned = countries.objects.world.geometries.map((plek) => {
  return plek.id;
});

console.log(JSON.stringify(cleaned));
