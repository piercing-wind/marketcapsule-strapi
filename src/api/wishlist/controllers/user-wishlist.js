module.exports ={
    add:async(ctx)=>{
        try {
            if(!ctx.state.user || !ctx.state.user.id){
                return ctx.badRequest("Please login first")
            }

            let userId = ctx.state.user.id;
            const {companyId} = ctx.request.body;
            if(!companyId){
                return ctx.badRequest("CompanyId missing!")
            }

            let companyExist = await strapi.db.query("api::wishlist.wishlist").findOne({where:{companyId}});
            if(companyExist){
                return ctx.badRequest("Already in wishlist!")
            }

            let addToWishlist = await strapi.db.query("api::wishlist.wishlist").create({data:{companyId:companyId,userId:userId}})
            if(!addToWishlist){
                return ctx.badRequest("Error in add to wishlist")
            }

            return ctx.response.send({
                success:true,
                message:"Successfully added to wishlist"
            })
            
        } catch (error) {
            return ctx.badRequest(error)
        }
    },
    list:async(ctx)=>{
        try {
            if(!ctx.state.user || !ctx.state.user.id){
                return ctx.badRequest("Please login first")
            }
            
            let userId = ctx.state.user.id;
            let { limit, page} = ctx.request.query
            console.log(ctx.request.query);
            limit = parseInt(limit) || 10;
            page = parseInt(page) || 1;

            let offset = (page - 1) * limit;


            let whereQuery={}

            let list = await strapi.db.query("api::wishlist.wishlist").findMany(({
                where:{userId:userId},
                populate:{
                    companyId:{
                        select:["id"],
                        populate:{
                            company_share_detail:{

                                select:["ltp","prevClosePrice","dayHigh","dayLow","changeInPercent","change"]
                            }
                        }
                    }
                },
                offset:offset,
                limit:limit,
                orderBy: { createdAt: 'desc'}
                
            }))

            let count=await strapi.db.query("api::wishlist.wishlist").count({where:whereQuery})

            return ctx.response.send({
                success:true,
                message:"success",
                count:count,
                data:list
            })
            
        } catch (error) {
            return ctx.badRequest(error)
        }
    },
    remove:async(ctx)=>{
        try {
            if(!ctx.state.user || !ctx.state.user.id){
                return ctx.badRequest("Please login first")
            }

            let userId = ctx.state.user.id;

            let {companyId} = ctx.request.params;
            if(!companyId){
                return ctx.badRequest("CompanyId missing!")
            }

           await strapi.db.query("api::wishlist.wishlist").delete({where:{userId,companyId}})
           return ctx.response.send({
            success:true,
            message:"Removed from Watchlist."
           })
            
        } catch (error) {
            return ctx.badRequest(error)
        }
    }
}