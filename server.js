const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Rotta principale
app.get('/', (req, res) => {
  res.send('Ciao! La tua app GPU funziona!');
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
