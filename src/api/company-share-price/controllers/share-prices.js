module.exports={
    list:async(ctx)=>{
        try {

            let {companySlug,startDate,endDate}  = ctx.request.query;

            
            let companyId;
            if(!companySlug){
                return ctx.badRequest("CompanySlug is missing")
            }

            if(companySlug){

                let company = await strapi.db.query("api::company.company").findOne({where:{slug:companySlug},select:["id"]});

                if(!company){
                    return ctx.badRequest("Invalid company slug!")
                }
                companyId = company.id;
            }
            if(!companyId){
                return ctx.badRequest("CompanyId missing!")
            }
            let dt =new Date();
            dt.setFullYear(dt.getFullYear()-1)

            startDate = startDate || dt
            endDate = endDate || new Date()

            console.log("startDate",startDate);
            console.log("endDate",endDate);


            let whereQuery={
                companyId:parseInt(companyId),
                // ...(exchangeName && {exchangeName:exchangeName}),
                ...{$and:[
                    {
                        date:{$gte:new Date(startDate)}
                    },
                    {
                        date:{$lte:new Date(endDate)}
                    }
                ]},
                // ...(startDate && {date:{$gte:new Date(startDate)}}),
                // ...(endDate&& {date:{$lte:new Date(endDate)}})
            }

            console.log("whereQuery",whereQuery);

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