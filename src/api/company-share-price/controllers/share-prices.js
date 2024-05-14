module.exports={
    list:async(ctx)=>{
        try {

            let {companyId,exchangeName,startDate,endDate}  = ctx.request.query;

            if(!companyId){
                return ctx.badRequest("CompanyId missing!")
            }

            let whereQuery={
                companyId:parseInt(companyId),
                ...(exchangeName && {exchangeName:exchangeName}),
                ...(startDate && {date:{$gte:new Date(startDate)}}),
                ...(endDate&& {date:{$lte:new Date(endDate)}})
            }

            let prices = await strapi.db.query("api::company-share-price.company-share-price").findMany({
                where:whereQuery
            })

            return ctx.response.send({
                success:true,
                message:"Data fetched",
                data:prices
            })
            
        } catch (error) {
            console.log(error);
            return ctx.badRequest(error);
        }
    }
}