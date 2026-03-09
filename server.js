// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express()); 

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

// Maak een GET route voor de index (meestal doe je dit in de root, als /)
app.get('/', async function (request, response) {
  const sort = request.query.sort || ''

  // Haal de lampen op met de sorteer-parameter
  const lampsResponse = await fetch(`https://fdnd-agency.directus.app/items/vdle_lamps?sort=${sort}`)
  const lampsJSON = await lampsResponse.json()

  // Haal categorieën op voor het menu
  const categoriesResponse = await fetch('https://fdnd-agency.directus.app/items/vdle_categories?sort=sort')
  const categoriesJSON = await categoriesResponse.json()

  response.render('index.liquid', { 
    items: lampsJSON.data, 
    categories: categoriesJSON.data,
    query: request.query,
    path: request.path
  })
})

app.get('/prodcuten', async function (request, response) {
  const sort = request.query.sort || ''

  // Haal de lampen op met de sorteer-parameter
  const lampsResponse = await fetch(`https://fdnd-agency.directus.app/items/vdle_lamps?sort=${sort}`)
  const lampsJSON = await lampsResponse.json()

  // Haal categorieën op voor het menu
  const categoriesResponse = await fetch('https://fdnd-agency.directus.app/items/vdle_categories?sort=sort')
  const categoriesJSON = await categoriesResponse.json()

  response.render('producten.liquid', { 
    items: lampsJSON.data, 
    categories: categoriesJSON.data,
    query: request.query,
    path: request.path
  })
})


app.get('/categorie/:id', async function (request, response) {
  const categoryId = request.params.id
  const sort = request.query.sort || ''

  // Filter op categorie ÉN sorteer
  const lampsResponse = await fetch(
    `https://fdnd-agency.directus.app/items/vdle_lamps?filter[category][_eq]=${categoryId}&sort=${sort}`
  )
  const lampsJSON = await lampsResponse.json()

  const categoriesResponse = await fetch('https://fdnd-agency.directus.app/items/vdle_categories?sort=sort')
  const categoriesJSON = await categoriesResponse.json()

  response.render('index.liquid', { 
    items: lampsJSON.data, 
    categories: categoriesJSON.data,
    query: request.query 
  })
})

app.use((request, response) => {
  response.render("404.liquid");
});

// Maak een POST route voor de index; hiermee kun je bijvoorbeeld formulieren afvangen
// Hier doen we nu nog niets mee, maar je kunt er mee spelen als je wilt
app.post('/', async function (request, response) {
  // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
  // Er is nog geen afhandeling van een POST, dus stuur de bezoeker terug naar /
  response.redirect(303, '/')
})

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
