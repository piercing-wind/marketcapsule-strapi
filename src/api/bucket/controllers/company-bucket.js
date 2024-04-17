const company = require("../../company/controllers/company");

module.exports = {
    list:async(ctx)=>{
        try {
            
            let {page,limit} = ctx.request.query;
            limit = parseInt(limit) ||10;
            page= parseInt(page) || 1;

            let offset = (page-1)*limit;

            let whereQuery={}

            if(ctx.request.query.categoryId){
                whereQuery.category = ctx.request.query.categoryId
            }

            let buckets = await strapi.db.query("api::bucket.bucket").findMany({
                where:whereQuery,
                offset:offset,
                limit:limit,
                orderBy:{ createdAt: 'desc', updatedAt: 'desc' }
            })
            let count = await strapi.db.query("api::bucket.bucket").count({where:whereQuery});

            let data=[]

            if(buckets.length>0){
                for (const item of buckets) {

                    console.log("id",item.id)
                    
                   let obj=JSON.parse(JSON.stringify(item));
                   let count = await strapi.db.query("api::company.company").count({
                    where:{
                        bucket:{
                            id:item.id
                        }
                    },

                    populate:{
                        bucket:true
                    }
                   })
                   obj.companyCount=count
                   data.push(obj)
                }
            }

            return ctx.response.send({
                success:true,
                count:count,
                data:data
            })
            
        } catch (err) {
            console.log(err);
            return ctx.badRequest(err)
        }
    }
}