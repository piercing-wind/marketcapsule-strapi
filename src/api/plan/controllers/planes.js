const {AddDaysToTime} = require("../../subscription/utils/index");
const {convertHtmlIntoPdf,invoiceHtml} = require("../../../../helper/index");
const {uploadFileToS3} = require("../../../../helper/aws")

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
                let {error,discountAmount} = await strapi.service("api::promo-code.promo-code").checkPromoCode(promoCode,planId);

                if(error){
                    return ctx.badRequest(error)
                }
                res.promoCodeDiscount=discountAmount;
                res.totalPayableAmount = res.totalPayableAmount-res.promoCodeDiscount
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
            const {amount,planId,currency,promoCode}=ctx.request.body;

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
    },
    invoice:async(ctx)=>{
        try {
            let html = invoiceHtml();
            const pdfBuffer = await convertHtmlIntoPdf(html);
            const url =await  uploadFileToS3(process.env.AWS_BUCKET,"invoice123",pdfBuffer);
            console.log("url",url);
            return ctx.send(url)
            
        } catch (error) {
            return ctx.badRequest(error)
        }
    }
}