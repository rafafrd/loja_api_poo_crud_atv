import express from 'express';
import path from 'node:path';
import { EnvVar } from './config/EnvVar';
import router from './routes/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve a pasta uploads como arquivos estáticos
// Ex: GET /uploads/images/abc123-foto.jpg
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/",router);


app.listen(EnvVar.SERVER_PORT, () => {console.log(`Server rodando na porta http://localhost:${EnvVar.SERVER_PORT}`)});