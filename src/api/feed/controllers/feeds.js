module.exports={
    list:async(ctx)=>{
        try {

            let isPremiumUser=false;

            if(ctx.request.header.authorization){

                let decode = await strapi.plugins[
                    'users-permissions'
                  ].services.jwt.getToken(ctx);
                  
                  if(decode){
                    let user = await strapi.db.query("plugin::users-permissions.user").findOne({where:{id:decode.id},select:["capsuleplus"]});

                    if(user){
                        isPremiumUser = user.capsuleplus
                    }
                  }
            }

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
                    image:{
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

            if(feeds.length>0){
                feeds = feeds.map((feed)=>{
                    if(feed.type==="CAPSULE+"){
                        feed.isPremium = isPremiumUser?false:true
                    }

                    return feed
                })
            }

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
    },
    getBySlug:async(ctx)=>{
        try {
            const {slug} = ctx.request.params
            if(!slug){
                return ctx.badRequest("Slug is missing!")
            }

            const feed = await strapi.db.query("api::feed.feed").findOne({
                where:{slug:slug},
                populate:{
                    image:{
                        select:["alternativeText","url"]
                    }
                }
            })

            return ctx.response.send({
                success:true,
                message:"Success",
                data:feed
            })
            
        } catch (error) {
            console.log("error",error)
        }
    }
}