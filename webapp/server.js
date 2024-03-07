import app from "./app.js";
import logger from "./config/logger.js";

const port = 8080;

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

