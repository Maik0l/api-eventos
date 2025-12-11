const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let events = [];

// Validação simples
const validateEvent = (payload) => {
  const { nome, localizacao, dataDoEvento, periodoInscricao } = payload;
  if (!nome || !localizacao || !dataDoEvento || !periodoInscricao) {
    return false;
  }
  return true;
};

// Criar evento (POST)
app.post('/events', (req, res) => {
  const payload = req.body;

  if (!validateEvent(payload)) {
    return res.status(400).json({
      error: 'Campos obrigatórios: nome, localizacao, dataDoEvento, periodoInscricao'
    });
  }

  const id = events.length > 0 ? events[events.length - 1].id + 1 : 1;

  const newEvent = {
    id,
    nome: payload.nome,
    localizacao: payload.localizacao,
    dataDoEvento: payload.dataDoEvento,
    periodoInscricao: payload.periodoInscricao
  };

  events.push(newEvent);

  return res.status(201).json(newEvent);
});

// Listar todos os eventos (GET)
app.get('/events', (req, res) => {
  res.json(events);
});

// Obter evento por ID (GET)
app.get('/events/:id', (req, res) => {
  const id = Number(req.params.id);
  const event = events.find((e) => e.id === id);

  if (!event) {
    return res.status(404).json({ error: 'Evento não encontrado' });
  }

  res.json(event);
});

// Atualizar evento (PUT)
app.put('/events/:id', (req, res) => {
  const id = Number(req.params.id);
  const payload = req.body;

  if (!validateEvent(payload)) {
    return res.status(400).json({
      error: 'Campos obrigatórios: nome, localizacao, dataDoEvento, periodoInscricao'
    });
  }

  const index = events.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Evento não encontrado' });
  }

  const updated = {
    ...events[index],
    nome: payload.nome,
    localizacao: payload.localizacao,
    dataDoEvento: payload.dataDoEvento,
    periodoInscricao: payload.periodoInscricao
  };

  events[index] = updated;

  res.json(updated);
});

// Deletar evento (DELETE)
app.delete('/events/:id', (req, res) => {
  const id = Number(req.params.id);

  const index = events.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Evento não encontrado' });
  }

  const deleted = events.splice(index, 1)[0];

  res.json({ deleted });
});

// Rota inicial (health check)
app.get('/', (req, res) => {
  res.send('Events API - online');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
