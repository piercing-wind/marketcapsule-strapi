const {AddDaysToTime} = require("../../subscription/utils/index");

module.exports={
    checkout:async(ctx)=>{
        try {

            const {planId,promoCode} = ctx.request.body;

            if(!planId){
                return ctx.badRequest("PlanId is missing!")
            }

            let plan = await strapi.db.query("api::plan.plan").findOne({where:{id:planId}});
            if(!plan){
                return ctx.badRequest("Plan not exist!")

            }

            let res = {
                amount:plan.price,
                discount:0,
                totalPayableAmount:plan.price
            }

            if(promoCode){
            
            }

            return ctx.response.send({
                success:true,
                message:"Success",
                data:res
            })
            
        } catch (error) {
            return ctx.badRequest(error)
        }
    },
    buy:async(ctx)=>{
        try {
            let userId = ctx.state.user.id;
            const {amount,planId,currency}=ctx.request.body;

            if(!planId){
                return ctx.badRequest("PlanId is missing!")
            }

            if(!amount){
                return ctx.badRequest("Amount is missing!")
            }
            if(!currency){
                    return ctx.badRequest("Currency is missing!")
            }

            let plan = await strapi.db.query("api::plan.plan").findOne({
                where:{id:planId}
            })
            if(!plan){
                return ctx.badRequest("Plan not exist!")

            }
            console.log("plan",plan);

            // create user subscription here...
            let obj={
                userId:userId,
                plan:planId,
                paymentStatus:"PENDING",
                amount:amount
            }

            let newSubscription =await strapi.db.query("api::subscription.subscription").create({data:obj});
            if(!newSubscription){
                return ctx.response.send({success:false,message:"Error while buying subscription."})
            }

            return ctx.response.send(newSubscription)


            
        } catch (error) {
            return ctx.badRequest(error)
        }
    },

    webhook:async(ctx)=>{
        try {

            
            
        } catch (error) {
            return ctx.badRequest(error)
        }
    }
}