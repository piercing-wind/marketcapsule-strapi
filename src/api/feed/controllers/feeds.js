module.exports={
    list:async(ctx)=>{
        try {

            let { limit, page,industryId} = ctx.request.query
            console.log(ctx.request.query);
            limit = parseInt(limit) || 10;
            page = parseInt(page) || 1;

            let offset = (page - 1) * limit;
            
            let whereQuery={}
            if(industryId){
                industryId=parseInt(industryId)
                whereQuery["industry"]=industryId
            }
            
            let feeds = await strapi.db.query("api::feed.feed").findMany({
                where:whereQuery,
                populate:{
                    featuredImage:{
                        select:["alternativeText","url"]
                    },
                    tag:{
                        select:["colorHash"]
                    }
                },
                offset:offset,
                limit:limit,
                orderBy: { createdAt: 'desc', updatedAt: 'desc' }
            })

            let count = await strapi.db.query("api::feed.feed").count({where:whereQuery})
 
            return ctx.response.send({
                success:true,
                message:"Success",
                count:count,
                data:feeds
            })
            
        } catch (error) {
            ctx.badRequest(error)
        }
    }
}