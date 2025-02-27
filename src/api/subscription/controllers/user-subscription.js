
const {daysBetween} = require("../../../../helper/utils");
const {sendEmail} = require("../../../../helper/zeptomail")

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
    },
    getSubscription:async(ctx)=>{
        try {
            const activeSubscriptions = await strapi.db.query("api::subscription.subscription").findMany({
                where: {
                    expiryDate: {
                        $gt: new Date()
                    },
                    active: true
                },
                populate: {
                    userId: {
                        select: ["id"]
                    },
                    plan: {
                        select: ["name", "planType"]
                    }
                }
            })

            if(activeSubscriptions.length>0){
                const currentDate = new Date();
                for (const subscription of activeSubscriptions) {
                    console.log("123456789",subscription);
                    let diff = daysBetween(currentDate,subscription.expiryDate);

                    console.log("daysBetween",diff)

                    if(diff===7){
                        await sendEmail("rahulkumar220719999@gmail.com","beforeSubscriptionExpire",JSON.stringify({name:"Rahul",planName:"Basic",day:7}))
                    }
                    else if(diff===3){
                        console.log("33333",subscription.id)

                    }
                    else if(diff===1){
                        await sendEmail("rahulkumar220719999@gmail.com","beforeSubscriptionExpire",JSON.stringify({name:"Rahul",planName:"Basic",day:1}))
                    }
                }
            }

            return ctx.send("hello")


            
        } catch (error) {
            console.log("error",error);
        }
    }
}