const express = require('express')
const app = express()
const port = 3200

app.get('/', (req, res) => res.send('Soon-to-be spotify cool stuff'))

app.listen(port, () => console.log(`Dummy  app listening on port ${port}!`))
