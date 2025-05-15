import express from 'express';
import routes from './routes/index.js';

const app = express();
app.use(express.json());

// rutas
app.use('/api', routes);

// server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});