import swaggerUI from "swagger-ui-express"; 
import YAML from "yamljs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerJSDocs = YAML.load(
  path.resolve(__dirname, "../SwaggerDocs/api.yaml")
);

const options = {
  customCss: `
    .swagger-ui .topbar { display: none; } /* Hide the top bar */
    .swagger-ui .info { text-align: center; font-family: 'Arial', sans-serif; font-size: 1.2em; color: #333; } /* Style API info */
    .swagger-ui .info .title { font-weight: bold; font-size: 1.5em; color: #007bff; } /* Style title */
    .swagger-ui .info .description { font-size: 1em; color: #555; margin-top: 5px ; } /* Style description */
    .swagger-ui .info .version { font-size: 0.9em; color: #999; } /* Style version */
    .swagger-ui .btn { background-color: #007bff; color: white; border-radius: 5px; padding: 5px 10px; font-weight: bold; } /* Style buttons */
    .swagger-ui .opblock-summary { background-color: #f8f9fa; border-radius: 5px; padding: 15px; margin-bottom: 10px; } /* Style API operation blocks */
    .swagger-ui .operations-wrapper { max-width: 800px; margin: 0 auto; padding: 20px; } /* Center the operations */
  `,
  customSiteTitle: "Task Management API",
};

const swaggerServe = swaggerUI.serve;
const swaggerSetup = swaggerUI.setup(swaggerJSDocs, options);

export { swaggerServe, swaggerSetup };
