const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ===== DATABASE TEMPORANEO =====
const users = {
  "1": { id: "1", name: "Mario", balance: 100 },
  "2": { id: "2", name: "Luca", balance: 50 }
};

// ROTTA PRINCIPALE
app.get('/', (req, res) => {
  res.send('Backend GPU attivo');
});

// ===============================
// ADMIN – AGGIUNGI SALDO UTENTE
// ===============================
app.post("/admin/add-balance", (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || amount === undefined) {
    return res.status(400).json({ error: "Dati mancanti" });
  }

  const user = users[userId];

  if (!user) {
    return res.status(404).json({ error: "Utente non trovato" });
  }

  const importo = Number(amount);
  if (isNaN(importo)) {
    return res.status(400).json({ error: "Importo non valido" });
  }

  user.balance += importo;

  res.json({
    success: true,
    userId,
    nuovoSaldo: user.balance
  });
});

// AVVIO SERVER
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
