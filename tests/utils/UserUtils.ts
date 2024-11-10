import {prismaClient} from "../../src/applications/database";
import bcrypt from "bcrypt";

const deleteUser=async () => {
    await prismaClient.user.deleteMany({});
}

const createUser=async () => {
    await prismaClient.user.create({
            data:{
                username:"test",
                name:"test",
                password:await bcrypt.hash("test",10),
                token: "test"
            }
        });
}

const getUser=async() => {
    const user=await prismaClient.user.findFirst({
        where:{
            username:"test"
        }
    });
   
    if(!user){
        throw new Error("User is not found");
    }

    return user;
}

export {
    deleteUser,
    createUser,
    getUser
}