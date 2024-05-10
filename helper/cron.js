module.exports={
    checkSubscriptionExpiry:{
        task:async({strapi})=>{
          
            const activeSubscriptions = await strapi.db.query("api::subscription.subscription").findMany({
                where:{
                    expiryDate:{
                        $lt:new Date()
                    },
                    active:true
                },
                populate:{
                    userId:{
                        select:["id"]
                    },
                    plan:{
                        select:["name","planType"]
                    }
                }
            })
          
            if(activeSubscriptions.length>0){
                for (const item of activeSubscriptions) {
                    await strapi.db.query("api::subscription.subscription").update({
                        data:{
                            active:false
                        },
                        where:{
                            id:item.id
                        }
                    })
                    

                    await strapi.db.query("plugin::users-permissions.user").update({
                        data:{
                            capsuleplus:false
                        },
                        where:{
                            id:item.userId.id
                        }
                    })

                    //create notification...

                    await strapi.db.query("api::notification.notification").create({
                        data:{
                            title:"Subscription Expired!",
                            message:`Your ${item.plan.name} subscription has been expired.`,
                            userId:item.userId.id
                        }
                    })

                    let user = await strapi.db.query("plugin::users-permissions.user").findOne({
                        where:{
                            id:item.userId.id
                        },
                        select:["id","socketId"]
                    })

                    // send socket notification here...
                    strapi.io.to(user.socketId).emit('notification', {
                        title:"Subscription Expired!",
                        message:`Your ${item.plan.name} subscription has been expired.`,
                    })
                   
                }

            }
        },
        options:{
            rule:"* */30 * * * *"
        }
    }
}