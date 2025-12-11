const request = require('supertest');
const app = require('../index');
const path = require('path');

describe('API de Eventos', () => {
  it('deve criar um novo evento com imagem (POST /events)', async () => {
    const response = await request(app)
      .post('/events')
      .field('nome', 'Evento Teste')
      .field('descricao', 'Um evento criado apenas para testar a API.')
      .field('localizacao', 'Universidade')
      .field('dataDoEvento', '2025-12-10')
      .field('periodoInscricao', '2025-12-01 a 2025-12-09')
      .attach('imagem', path.join(__dirname, 'imagem-teste.png'));

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('imagem');
  });

  it('deve retornar a lista de eventos (GET /events)', async () => {
    const response = await request(app).get('/events');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('deve atualizar um evento existente (PUT /events/:id)', async () => {
    const response = await request(app)
      .put('/events/1')
      .field('nome', 'Evento Atualizado')
      .field('descricao', 'Um evento atualizado apenas para testar a API.')
      .field('localizacao', 'Auditório')
      .field('dataDoEvento', '2025-11-20')
      .field('periodoInscricao', '2025-11-01 a 2025-11-15')
      .attach('imagem', path.join(__dirname, 'imagem-teste.png'));

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe('Evento Atualizado');
  });

  it('deve excluir um evento (DELETE /events/:id)', async () => {
    const response = await request(app).delete('/events/1');
    expect(response.status).toBe(200);
  });
});
