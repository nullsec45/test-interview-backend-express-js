import {prismaClient} from "../../src/applications/database";

const removeTestOrder=async () => {
    await prismaClient.order.deleteMany({});
}

const createManyTestOrder = async () => {
  
};

export {
    removeTestOrder,
    createManyTestOrder,
}