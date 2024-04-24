module.exports={
    demo:{
        task:async({strapi})=>{
            console.log("1234567890");
        },
        options:{
            rule:"* */5 * * * *"
        }
    }
}