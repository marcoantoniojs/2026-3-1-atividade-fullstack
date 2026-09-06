import { createApp } from "./app.js";
import { env } from "./env.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`API do Diatinf X em http://localhost:${env.PORT}`);
});
