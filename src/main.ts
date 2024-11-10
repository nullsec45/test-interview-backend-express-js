import { server } from "./applications/server";
import {logger} from "./applications/logger";

const port:number=8080;
server.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});