const express = require('express');
const axios = require("axios");
const app = express();
const port = 3000;
const pokeUrl = "https://pokeapi.co/api/v2";

//import library CORS
const cors = require('cors')

//use cors
app.use(cors())

//import body parser
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/pokemon-list', async (req, res) => {
  const resp = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=20")
  let list = resp.data.results;
  list = list.map((d) => {
    return {
      id: d.url.slice(0, -1).split("/").pop(),
      name : d.name
    };
  });
  res.json(list);
})

app.get('/pokemon-detail/:id', async(req, res) => {
  const getId = req.params.id;
  const url = `${pokeUrl}/pokemon/${getId}`;
  const resp = await axios.get(url);
  let detail = await resp.data;

  let {id, name, base_experience, height, weight} = detail;
  let sprite = detail.sprites.front_default;
  let stats = detail.stats.map((d) => {
    return {
      name : d.stat.name,
      value : d.base_stat
    }
  });
  let types = detail.types.map((d) => d.type.name);
  let abilities = detail.abilities.map((d) => d.ability.name);
  let moves = detail.moves.map((d) => d.move.name);

  const pokemon = {
    id: id,
    name: name,
    base_experience: base_experience,
    height: height,
    weight: weight,
    sprite: sprite,
    stats: stats,
    types: types,
    abilities: abilities,
    moves: moves,
  };

  res.json(pokemon);
});

app.get('/catch/:id', (req, res) => {
  const id = req.params.id;
  var number = Math.random();
  if (number < 0.5) {
    return res.status(200).json({
      status: true,
      message: 'Successfull catch pokemon!',
    })
  } else {
    return res.status(200).json({
      status: false,
      message: "Failed catch pokemon!",
    });
  }
});

app.get('/release/:id', (req, res) => {
  return res.status(200).json({
    result: Math.floor(Math.random() * 7)
  })
})

app.post("/rename/:id", (req, res) => {
  const id = req.body.id;
  const name = req.body.real_name;
  const seq = req.body.seq;  
  const fib = fibonacci(seq);

  if(seq > 1){
    
    return res.status(200).json({
      result: fib,
      name: name+"-"+fib.pop()
    });
  } else {
    return res.status(200).json({
      result: [0],
      name: name + "-0",
    });
  }

})

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`)
})

function fibonacci(num) {
  var answer = [];
  var x = 0;
  var y = 1;
  var z;

  answer.push(x);
  answer.push(y);

  var i = 2;
  while (i < num) {
    z = x + y;
    x = y;
    y = z;

    answer.push(z);
    i = i + 1;
  }
  return answer;
}