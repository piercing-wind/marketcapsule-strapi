module.exports={
    checkPromoCode:async(ctx)=>{
        try {
            let {promoCode,planId} = ctx.request.body;

            if(!promoCode){
                return ctx.badRequest("PromoCode missing!")
            }

            let {error,discountAmount} = await strapi.service("api::promo-code.promo-code").checkPromoCode(promoCode,planId);

            if(error){
                return ctx.badRequest(error)
            }


            return ctx.send({
                success:true,
                message:`Rs ${discountAmount} off on capsule+ subscription`,
                data:{
                    discount:discountAmount
                }
            })
            
        } catch (error) {
            return ctx.badRequest(error)
        }
    }
}