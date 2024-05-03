'use strict';

/**
 * promo-code service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::promo-code.promo-code',({strapi})=>({
    checkPromoCode:async(promoCode,planId)=>{
        promoCode = promoCode.toUpperCase()

        let whereQuery

        let findPromoCode = await strapi.db.query("api::promo-code.promo-code").findOne({
            where:{code:promoCode,isActive:true},
            populate:{
                plan:{
                    select:["id"]
                }
            }
        })



        if(planId && findPromoCode.plan &&  findPromoCode.plan?.id !==planId){
            return {error:'Promo Code not aplicable on this plan!',discountAmount:0}
        }


        if(!findPromoCode){
            return {error:'Invalid PromoCode!',discountAmount:0}
        }

        let dt = new Date();
        if(dt>findPromoCode.expiryDate){
            return {error:'PromoCode expired!',discountAmount:0}
        }

        if(promoCode.maxUsage>0 && promoCode.maxUsage===promoCode.availedCount){
            return {error:'"PromoCode usage limit reached!',discountAmount:0}
        }
        return {error:null,discountAmount:findPromoCode.discountAmount}
    }
}));
