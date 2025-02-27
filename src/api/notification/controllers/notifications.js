module.exports={
    list:async(ctx)=>{
        try {
            if(!ctx.state.user || !ctx.state.user.id){
                return ctx.badRequest("Please login first")
            }

            let userId = ctx.state.user.id;

            let {limit,page}  = ctx.request.query;

            limit = parseInt(limit) || 10;
            page = parseInt(page) || 1;

            let offset = (page - 1) * limit;

            let notifications = await strapi.db.query("api::notification.notification").findMany({
                where:{
                    userId:userId
                },
                offset: offset,
                limit: limit,
                orderBy: { createdAt: 'desc', updatedAt: 'desc' }
            })

            let count  =  await strapi.db.query("api::notification.notification").count({
                where:{
                    userId:userId
                },
            })


            return ctx.response.send({
                success:true,
                message:"Data Fetched!",
                count,
                data:notifications
            })
            

            
        } catch (error) {
            console.log(error);
            return ctx.badRequest(error)
        }
    }
}