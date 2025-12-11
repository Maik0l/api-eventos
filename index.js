const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/');
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    callback(null, uniqueName);
  }
});

const upload = multer({ storage });

app.use(express.json());

// Base de dados em memória
let events = [];

// Validação
const validateEvent = (payload) => {
  const { nome, descricao, localizacao, dataDoEvento, periodoInscricao } = payload;
  return nome && descricao && localizacao && dataDoEvento && periodoInscricao;
};

// Rotas
app.post('/events', upload.single('imagem'), (req, res) => {
  const payload = req.body;
  const arquivo = req.file;

  if (!validateEvent(payload)) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }

  const id = events.length > 0 ? events[events.length - 1].id + 1 : 1;

  const newEvent = {
    id,
    nome: payload.nome,
    descricao: payload.descricao,
    localizacao: payload.localizacao,
    dataDoEvento: payload.dataDoEvento,
    periodoInscricao: payload.periodoInscricao,
    imagem: arquivo ? arquivo.filename : null
  };

  events.push(newEvent);
  return res.status(201).json(newEvent);
});

app.get('/events', (req, res) => {
  return res.json(events);
});

app.get('/events/:id', (req, res) => {
  const id = Number(req.params.id);
  const ev = events.find((e) => e.id === id);

  if (!ev) return res.status(404).json({ error: 'Evento não encontrado.' });

  return res.json(ev);
});

app.put('/events/:id', upload.single('imagem'), (req, res) => {
  const id = Number(req.params.id);
  const index = events.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Evento não encontrado.' });
  }

  const data = {
    nome: req.body.nome,
    descricao: req.body.descricao,
    localizacao: req.body.localizacao,
    dataDoEvento: req.body.dataDoEvento,
    periodoInscricao: req.body.periodoInscricao,
    imagem: req.file ? req.file.filename : events[index].imagem
  };

  events[index] = { id, ...data };

  return res.json(events[index]);
});

app.delete('/events/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = events.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Evento não encontrado.' });
  }

  const removed = events.splice(index, 1)[0];
  return res.json({ removed });
});

app.get('/', (req, res) => {
  res.send('Events API - online');
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

module.exports = app;
