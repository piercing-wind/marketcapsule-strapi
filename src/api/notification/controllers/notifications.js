module.exports={
    list:async(ctx)=>{
        try {
            if(!ctx.state.user || !ctx.state.user.id){
                return ctx.badRequest("Please login first")
            }

            let userId = ctx.state.user.id;

            let notifications = await strapi.db.query("api::notification.notification").findMany({
                where:{
                    userId:userId
                }
            })

            return ctx.response.send({
                success:true,
                message:"Data Fetched!",
                data:notifications
            })
            

            
        } catch (error) {
            console.log(error);
            return ctx.badRequest(error)
        }
    }
}