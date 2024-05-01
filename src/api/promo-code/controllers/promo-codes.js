module.exports={
    checkPromoCode:async(ctx)=>{
        try {
            let {promoCode} = ctx.request.body;

            if(!promoCode){
                return ctx.badRequest("PromoCode missing!")
            }

            promoCode = promoCode.toUpperCase()

            let findPromoCode = await strapi.db.query("api::promo-code.promo-code").findOne({
                where:{code:promoCode,isActive:true}
            })

            if(!findPromoCode){
                return ctx.badRequest("Invalid PromoCode!")
            }

            let dt = new Date();
            if(dt>findPromoCode.expiryDate){
                return ctx.badRequest("PromoCode expired!")
            }

            if(promoCode.maxUsage>0 && promoCode.maxUsage===promoCode.availedCount){
                return ctx.badRequest("PromoCode usage limit reached!")
            }

            return ctx.send({
                success:true,
                message:`Rs ${findPromoCode.discountAmount} off on capsule+ subscription`,
                data:{
                    discount:findPromoCode.discountAmount
                }
            })
            
        } catch (error) {
            return ctx.badRequest(error)
        }
    }
}