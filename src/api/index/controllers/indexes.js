const {addDaysToDate} = require("../../../../helper/index")

module.exports = {
    list:async(ctx)=>{
        try {
            
            let {indexType="Sensex"} = ctx.request.query;

            if(!["Sensex","Nifty"].includes(indexType)){
                return ctx.badRequest("Invalid indexType!")
            }

            let todayDate = new Date();
            let previousDate = addDaysToDate(new Date(),-10)

            let findQuery={
                indexType:indexType,
                $and:[
                    {
                        date:{$gte:new Date(previousDate)}
                    },
                    {
                        date:{$lte:new Date(todayDate)}
                    }
                ]
            }
            
            let indexes = await strapi.db.query("api::index.index").findMany({
                where:findQuery,
                orderBy: { date: 'desc' }
            })

            let currentPrice = null;
            let changeInprice = null;
            let lastUpdated = new Date();
            let currentFIICash = null;

            if(indexes.length===1){
                currentPrice = indexes[0].price;
                changeInprice=0;
                lastUpdated = indexes[0].updatedAt;
                currentFIICash = indexes[0].FIICash
            }
            if(indexes.length>=2){
                currentPrice = indexes[0].price;
                changeInprice = currentPrice - indexes[1].price;
                lastUpdated = indexes[0].updatedAt;
                currentFIICash = indexes[0].FIICash
            }

            return ctx.response.send({
                success:true,
                message:"Data fetched!",
                data:{
                    lastUpdated,
                    currentPrice,
                    changeInprice,
                    currentFIICash,
                    indexes
                }
            })

        } catch (error) {
            console.log("error",error);
            return ctx.badRequest(error)
        }
    }
}