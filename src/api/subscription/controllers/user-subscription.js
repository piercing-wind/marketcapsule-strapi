module.exports={
    list:async(ctx)=>{
        try {
        
            let userId = ctx.state.user.id;

            let { limit, page} = ctx.request.query
            limit = parseInt(limit) || 10;
            page = parseInt(page) || 1;

            let offset = (page - 1) * limit;

            let userSubscriptions = await strapi.db.query("api::subscription.subscription").findMany({
                where:{
                    userId:userId,
                    paymentStatus:"COMPLETED"
                },
                populate:{
                    plan:{
                        select:["name","price","planType","durationInDays","currency"]
                    }
                },
                limit:limit,
                offset:offset,
                orderBy: { createdAt: 'desc'}
            })

            let count = await strapi.db.query("api::subscription.subscription").count({where:{
                userId:userId,
                    paymentStatus:"COMPLETED"
            }})

            let activeSubscription = await strapi.db.query("api::subscription.subscription").findOne({
                where:{
                    userId:userId,
                    active:true
                }
            })

            return ctx.response.send({
                success:true,
                message:"Success",
                count:count,
                data:{
                    userSubscriptions,
                    nextBillingDate:activeSubscription?activeSubscription.expiryDate:null
                }
            })
            
        } catch (error) {
            return ctx.badRequest(error)
        }
    }
}