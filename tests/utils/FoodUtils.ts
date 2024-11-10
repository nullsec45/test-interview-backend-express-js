import {prismaClient} from "../../src/applications/database";

const removeTestFood=async () => {
    await prismaClient.food.deleteMany({});
}

let foodArr=[
    {
        name:"Biscuit",
        price:6000,
        stock:50
    },
    {
        name:"Chips",
        price:8000,
        stock:50
    },
    {
        name:"Oreo",
        price:10000,
        stock:50
    },
    {
        name:"Tango",
        price:12000,
        stock:50
    },
    {
        name:"Cokelat",
        price:15000,
        stock:50
    },
];


const createTestFood=async () => {
   let food= await prismaClient.food.create({
        data:{
             name:"Biscuit",
             price:6000,
             stock:50
        },
        select:{
            id:true,
            name:true,
            price:true,
            stock:true
        }
    })

    return food;
}

const getTestFood=async () => {
   let province= await prismaClient.food.findFirst({
        where:{
            name:"Biscuit"
        },
        select:{
            id:true,
            name:true,
            price:true,
            stock:true
        }
    })

    return province;
}
const createManyTestFood = async () => {
  for (const food of foodArr) {
    try {
      await prismaClient.food.create({
        data: {
          name: food.name,
          price: food.price,
          stock: food.stock,
        },
      });
    } catch (error) {
      console.error(`Error creating food: ${food.name}`, error);
    }
  }
};

export {
    removeTestFood,
    createTestFood,
    getTestFood,
    createManyTestFood,
    foodArr
}