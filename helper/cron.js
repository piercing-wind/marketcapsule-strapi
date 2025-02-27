const {sendEmail} = require("./ses");
const {emailTemplate} = require("../config/constant");
const {daysBetween} = require("./utils")

module.exports = {
    checkSubscriptionExpiry: {
        task: async ({ strapi}) => {

            const activeSubscriptions = await strapi.db.query("api::subscription.subscription").findMany({
                where: {
                    expiryDate: {
                        $lt: new Date()
                    },
                    active: true
                },
                populate: {
                    userId: {
                        select: ["id","fullName","email"]
                    },
                    plan: {
                        select: ["name", "planType"]
                    }
                }
            })

            if (activeSubscriptions.length > 0) {
                for (const item of activeSubscriptions) {
                    await strapi.db.query("api::subscription.subscription").update({
                        data: {
                            active: false
                        },
                        where: {
                            id: item.id
                        }
                    })


                    await strapi.db.query("plugin::users-permissions.user").update({
                        data: {
                            capsuleplus: false
                        },
                        where: {
                            id: item.userId.id
                        }
                    })

                    //send template email to user

                    await sendEmail(item.userId.email,emailTemplate.subscriptionExpire,JSON.stringify({name:item.userId?.fullName?item.userId.fullName:item.userId.email,planName:activeSubscriptions?.plan?.name}))

                    //create notification...

                    await strapi.db.query("api::notification.notification").create({
                        data: {
                            title: "Subscription Expired!",
                            message: `Your ${item.plan.name} subscription has been expired.`,
                            userId: item.userId.id
                        }
                    })

                    // let user = await strapi.db.query("plugin::users-permissions.user").findOne({
                    //     where:{
                    //         id:item.userId.id
                    //     },
                    //     select:["id","socketId"]
                    // })

                    // // send socket notification here...
                    // strapi.io.to(user.socketId).emit('notification', {
                    //     title:"Subscription Expired!",
                    //     message:`Your ${item.plan.name} subscription has been expired.`,
                    // })

                }

            }
        },
        options: {
            rule: "* */30 * * * *"
        }
    },
    subscriptionWillExpire: {
        task: async ({ strapi }) => {
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
                            select: ["id","fullName","email"]
                        },
                        plan: {
                            select: ["name", "planType"]
                        }
                    }
                })
    
                if(activeSubscriptions.length>0){
                    const currentDate = new Date();
                    for (const subscription of activeSubscriptions) {

                        let diff = daysBetween(currentDate,subscription.expiryDate);
    
                        console.log("daysBetween",diff)
    
                        if(diff===7){
                            await sendEmail(subscription.userId.email,emailTemplate.beforeSubscriptionExpire,JSON.stringify({name:subscription.userId.fullName?subscription.userId.fullName:subscription.userId.email,planName:subscription.plan.name,day:10}))
                        }
                        else if(diff===3){
                            await sendEmail(subscription.userId.email,emailTemplate.beforeSubscriptionExpire,JSON.stringify({name:subscription.userId.fullName?subscription.userId.fullName:subscription.userId.email,planName:subscription.plan.name,day:3}))
    
                        }
                        else if(diff===1){
                            await sendEmail(subscription.userId.email,emailTemplate.beforeSubscriptionExpire,JSON.stringify({name:subscription.userId.fullName?subscription.userId.fullName:subscription.userId.email,planName:subscription.plan.name,day:1}))
                        }
                    }
                }
                

            } catch (error) {
                console.log("error in cron jobs", error);
            }
        },
        options: {
            rule: "0 */12 * * *"
        }
    }
}