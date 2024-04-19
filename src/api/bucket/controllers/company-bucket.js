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

                    
                   let obj=JSON.parse(JSON.stringify(item));
                   let count=await strapi.db.query("api::company.company").count({
                    where:{
                        "buckets":{
                            id:item.id
                        }
                    },
                    populate: {
                        buckets: true
                       },
                      
                       
                })
                  obj.count=count;
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
    },
    detail:async(ctx)=>{
        try {

            let {slug} = ctx.request.query
     
            if(!slug){
                return ctx.badRequest("Slug missing!")
            }
           let bucket = await strapi.db.query("api::bucket.bucket").findOne({
            where:{slug:slug},
            select:["name","slug","description"],
            populate:{
                companies:{
                    populate:{
                        company_share_detail:true,
                    }
                }
                
            }
           })

            return ctx.response.send({
                success:true,
                message:"Detail fetched",
                data:bucket
            })
            
        } catch (err) {
            console.log(err);
            return ctx.badRequest(err)
        }
    },
    filter:async(ctx)=>{
        try {

           let {slug} = ctx.request.params;
           console.log("slug",slug)
          let filters=[
            {
                filterName:"companyTypeId",
                name:'Type of SME',
                type:"checkbox",
                detail:[]
            },
            {
                filterName:"pe",
                name:'PE',
                type:"dropdown",
                detail:[
                    {
                        name:"Less Than 500 Cr",
                        lte:40
                    },
                    {
                        name:"Greater than 500 Cr",
                        gte:40
                    },
                ]
            },
            
            {
                filterName:"marketCap",
                name:'Market Cap',
                type:"checkbox",
                detail:[
                    {
                        name:"Less Than 500 Cr",
                        lte:500
                    },
                    {
                        name:"Greater than 500 Cr",
                        gte:500
                    },
                ]
            },
          ]

          let companyType = await strapi.db.query("api::company-type.company-type").findMany({select:["id","name","slug"]})
          filters[0]["detail"] = companyType

        //   let shareDetail  = await strapi.db.query("api::company-share-detail.company-share-detail").findMany({
        //     where:{
        //         "company":{
        //             "buckets":{
        //                 "slug":slug
        //             }
        //         }
        //     },
        //     select:["marketCap","peRatio"],
        //     populate:{
        //         company:{
        //             populate:{
        //                     buckets:true
        //             }
        //         }
        //     }
        //   })

            return ctx.response.send({
                success:true,
                message:"Detail fetched",
                filters
            })
            
        } catch (err) {
            console.log(err);
            return ctx.badRequest(err)
        }
    },
}