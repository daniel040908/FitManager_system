import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : PORT;
  const baseUrl = `http://localhost:${port}`;

  console.log(`FitManager API: ${baseUrl}`);
  console.log(`Documentacao Swagger: ${baseUrl}/docs`);
});
