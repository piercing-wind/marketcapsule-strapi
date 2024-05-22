module.exports={
    list:async(ctx)=>{
        try {

            let {companySlug,duration,startYear,endYear}=ctx.request.query;

            if(!companySlug){
                return ctx.badRequest("CompanySlug is missing")
            }

            if(duration && !["yearly","quarterly"].includes(duration)){
                return ctx.badRequest("Invalid duration!")
            }
            let companyId;

            if(companySlug){
                let company = await strapi.db.query("api::company.company").findOne({where:{slug:companySlug},select:["id"]});
                if(company){
                    companyId = companySlug
                }
            }

            let whereQuery={
                ...(companyId &&{company:parseInt(companyId)}),
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