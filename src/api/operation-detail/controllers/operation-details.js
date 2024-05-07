module.exports={
    list:async(ctx)=>{
        try {

            let {companyId,duration,startYear,endYear}=ctx.request.query;

            if(!companyId){
                return ctx.badRequest("CompanyId missing!")
            }

            if(duration && !["yearly","quarterly"].includes(duration)){
                return ctx.badRequest("Invalid duration!")
            }

            let whereQuery={
                company:parseInt(companyId),
                ...(duration && {duration:duration}),
                ...(startYear && {year:{$gte:parseInt(startYear)}}),
                ...(endYear&& {year:{$lte:parseInt(endYear)}})
            }

            let details = await strapi.db.query("api::operation-detail.operation-detail").findMany({
                where:whereQuery,
            })

            return ctx.response.send({
                success:true,
                message:"Data fetched",
                data:details
            })
            
        } catch (error) {
            return ctx.badRequest(error)
        }
    }
}