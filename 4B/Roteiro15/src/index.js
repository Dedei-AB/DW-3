import express from 'express';
import dotenv from 'dotenv';
import tarefasRepository from './repository/tarefasRepository.js';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/tarefas/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const tarefa = await tarefasRepository.buscarPorId(id);
    if (!tarefa) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    return res.json(tarefa);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno' });
  }
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
