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

            let companyExist = await strapi.db.query("api::wishlist.wishlist").findOne({where:{companyId,userId:userId}});

            if(companyExist){
                return ctx.badRequest("Already in Watchlist!")
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
            let { limit, page,sort} = ctx.request.query
            console.log(ctx.request.query);
            limit = parseInt(limit) || 10;
            page = parseInt(page) || 1;

            let offset = (page - 1) * limit;


            let whereQuery={};

            let list = await strapi.db.query("api::wishlist.wishlist").findMany(({
                where:{userId:userId},
                populate:{
                    companyId:{
                        select:["id","name"],
                        populate:{
                            company_share_detail:{

                                select:["ltp","prevClosePrice","dayHigh","dayLow","changeInPercent","change"],
                            }   
                        }
                    }
                },
                offset:offset,
                limit:limit,
                orderBy: { createdAt: 'desc'}
                
            }))

            let count=await strapi.db.query("api::wishlist.wishlist").count({where:whereQuery});
            let data=[]

            if(list.length>0){
                data=JSON.parse(JSON.stringify(list))
           
                if(sort==="LowHighLtp"){
            
                    data.sort((a,b)=>a.companyId?.company_share_detail?.ltp-b.companyId?.company_share_detail?.ltp)
                }
                if(sort==="highLowLtp"){
                    data.sort((a,b)=>b.companyId?.company_share_detail?.ltp-a.companyId?.company_share_detail?.ltp)
                }
                if(sort==="lowHighPreClosePrice"){
                    data.sort((a,b)=>a.companyId?.company_share_detail?.prevClosePrice-b.companyId?.company_share_detail?.prevClosePrice)
                }
                if(sort==="highLowPreClosePrice"){
                    data.sort((a,b)=>b.companyId?.company_share_detail?.prevClosePrice-a.companyId?.company_share_detail?.prevClosePrice)
                }
                if(sort==="lowHighChange"){
                    data.sort((a,b)=>a.companyId?.company_share_detail?.change-b.companyId?.company_share_detail?.change)
                }
                if(sort==="highLowChange"){
                    data.sort((a,b)=>b.companyId?.company_share_detail?.change-a.companyId?.company_share_detail?.change)
                }
                if(sort==="lowHighChange%"){
                    data.sort((a,b)=>a.companyId?.company_share_detail?.changeInPercent-b.companyId?.company_share_detail?.changeInPercent)
                }
                if(sort==="highLowChange%"){
                    data.sort((a,b)=>b.companyId?.company_share_detail?.changeInPercent-a.companyId?.company_share_detail?.changeInPercent)
                }
                if(sort==="lowHighDayHigh"){
                    data.sort((a,b)=>a.companyId?.company_share_detail?.dayHigh-b.companyId?.company_share_detail?.dayHigh)
                }
                if(sort==="highLowDayHigh"){
                    data.sort((a,b)=>b.companyId?.company_share_detail?.dayHigh-a.companyId?.company_share_detail?.dayHigh)
                }
                if(sort==="lowHighDayLow"){
                    data.sort((a,b)=>a.companyId?.company_share_detail?.dayLow-b.companyId?.company_share_detail?.dayLow)
                }
                if(sort==="highLowDayLow"){
                    data.sort((a,b)=>b.companyId?.company_share_detail?.dayLow-a.companyId?.company_share_detail?.dayLow)
                }

            }


            return ctx.response.send({
                success:true,
                message:"success",
                count:count,
                data:data
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