const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = 3000;
const fs = require('fs');
const geolib = require('geolib');


app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('works!');
});

app.post('/ahp', (req,res) => {
  // Variables
  lat = req.body.lat
  lon = req.body.lon
  maxDistance = req.body.maxDistance
  minPrice = req.body.minPrice
  maxPrice = req.body.maxPrice
  minM2 = req.body.minM2
  maxM2 = req.body.maxM2
  places = req.body.places
  ahpValues = req.body.ahpValues
  /// Calculate ahp user weights
  loc_weight_sum = 1 * Number(ahpValues.loc_price) * Number(ahpValues.loc_m2) * Number(ahpValues.loc_access)
  price_weight_sum = Number(1/ahpValues.loc_price) * 1 * Number(ahpValues.price_m2) * Number(ahpValues.price_access)  
  m2_weight_sum = Number(1/ahpValues.loc_m2) * Number(1/ahpValues.price_m2) * 1 * Number(ahpValues.m2_access)
  access_weight_sum = Number(1/ahpValues.loc_access) + Number(1/ahpValues.price_access) + Number(1/ahpValues.m2_access) + 1
  //
  weights_sum = loc_weight_sum + price_weight_sum + m2_weight_sum + access_weight_sum
  //
  distance_w = loc_weight_sum/weights_sum
  price_w = price_weight_sum/weights_sum
  m2_w = m2_weight_sum/weights_sum
  access_w = access_weight_sum/weights_sum

  console.log("Wspolczynniki AHP:")
  console.log("Lokalizacja", loc_weight_sum/weights_sum)
  console.log("Cena", price_weight_sum/weights_sum)
  console.log("Metraż", m2_weight_sum/weights_sum)
  console.log("Zgodność z punktami", access_weight_sum/weights_sum)

  console.log( loc_weight_sum/weights_sum + price_weight_sum/weights_sum + m2_weight_sum/weights_sum + access_weight_sum/weights_sum)

  try {
    const json_url = './estateInfo2.json'
    const data = fs.readFileSync(json_url, 'utf8');
    let properties = JSON.parse(data);

    let filteredProperties = properties.filter(property => 
      property.totalPrice_value <= maxPrice &&
      property.totalPrice_value >= minPrice &&
      property.areaInSquareMeters <= maxM2 &&
      property.areaInSquareMeters >= minM2 &&
      property.latitude != null &&
      property.longitude != null
    );

    // Filtracja `filteredProperties` aby wybrać te obiekty, które są w określonej odległości
    let propertiesWithinDistance = filteredProperties.filter(property => {
      const distance = geolib.getDistance(
        { latitude: property.latitude, longitude: property.longitude },
        { latitude: lat, longitude: lon }
      );
      return distance / 1000 <= maxDistance;
    });

    propertiesWithinDistance.forEach(property => {
      let distance = geolib.getDistance(
        { latitude: property.latitude, longitude: property.longitude },
        { latitude: lat, longitude: lon }
      );
      distance = distance / 1000
      property.distance_score = Math.round(((maxDistance - distance) / maxDistance) * 100)  
      property.m2_score = Math.round((property.areaInSquareMeters / maxM2) * 100)
      property.price_score = Math.round(((property.totalPrice_value - minPrice) / (maxPrice - minPrice)) * 100);
      // Obliczanie całkowitej liczby wybranych miejsc
      const totalSelectedPlaces = places.filter(place => place.checked).length;
  
      // Obliczanie liczby dostępnych wybranych miejsc w nieruchomości
      const availableSelectedPlaces = places.filter(place => 
        place.checked && property[place.name.toLowerCase().replace(/\s+/g, '_')]
      ).length;
  
      // Obliczanie wyniku w punktach
      const score = (availableSelectedPlaces / totalSelectedPlaces) * 100;
  
      // Zaokrąglanie wyniku do najbliższej liczby całkowitej
      const roundedScore = Math.round(score);

      property.places_score = roundedScore

      property.result = 
        property.distance_score * distance_w 
      + property.m2_score * m2_w 
      + property.price_score * price_w
      + property.places_score * access_w

      console.log(property)
    });
    
    




    
  } catch (blad) {
    console.error('Wystąpił błąd:', blad);
  }
})

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
