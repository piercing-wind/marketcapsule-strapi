'use strict';

/**
 * A set of functions called "actions" for `search`
 */

module.exports = {
  globalSearch: async (ctx, next) => {
    try {
      let {search} = ctx.request.query;
      if(!search){
        return ctx.badRequest("Search key missing!")
      }

      let capsuleplusCount=0;
      let iposCount=0;
      let bucketCount=0;
      let totalCount=0;
    
        let searchQuery={
            $or:[
                {
                    name:{$containsi:search}
                },
                {
                    about:{$containsi:search}
                },
                {
                    slug:{$containsi:search}
                },
                {
                    title:{$containsi:search}
                },
                {
                    industry:{
                        name:{$containsi:search}
                    }
                },
                {
                  industry:{
                      description:{$containsi:search}
                  }
              },
            ],
            
        }

        let ipoSearchQuery={
          $or:[
            {
              company:{
                name:{$containsi:search},
              }
            },
            {
              company:{
                about:{$containsi:search},
              }
            },
            {
              company:{
                title:{$containsi:search},
              }
            },
           {
            company:{
              industry:{
                name:{$containsi:search}
              }
            }
           },
           {
            company:{
              industry:{
                description:{$containsi:search}
              }
            }
           }
    
          ]
        }

        let bucketSearchQuery={
          $or:[
            {
              companies:{
                name:{$containsi:search},
              }
            },
            {
              companies:{
                about:{$containsi:search},
              }
            },
            {
              companies:{
                title:{$containsi:search},
              }
            },
            {
              companies:{
                industry:{
                  name:{$containsi:search}
                }
              }
             },
             {
              companies:{
                industry:{
                  description:{$containsi:search}
                }
              }
             }
    
          ]
        }

        let resData={
          capsuleplus:[],
          screener:[],
          ipoZone:[]
        }

        let companies = await strapi.db.query("api::company.company").findMany({
          where:searchQuery,
          select:["name","capsuleplus","slug"],
          populate:{
              indsutry:{
                  select:["name"]
              },
              featuredImage:{
                select: ["alternativeText", "url"]
              }
          },
      })

      capsuleplusCount = companies.length;


      let ipos = await strapi.db.query("api::ipo.ipo").findMany({
        where:ipoSearchQuery,
        select:["id"],
        populate:{
          company:{
            select:["name","capsuleplus","slug"],
            populate:{
              featuredImage:{
                select: ["alternativeText", "url"]
              },
              industry:{
                select:["name"]
            },

            }
          }
        }
      })


      console.log("bucketSearchQuery",bucketSearchQuery);

      // let buckets = await strapi.db.query("api::bucket.bucket").findMany({
      //   where:bucketSearchQuery,
      //   // select:["id","name","slug"],
      //   populate:{
      //     companies:{
      //       // select:["id","name","slug","title","about","capsuleplus","description"],
      //       // filters:{
      //       //   $or:[

      //       //     {name:{$containsi:search}},
      //       //     {about:{$containsi:search}},
      //       //     // {title:{$containsi:search}},
      //       //     // {industry:{name:{$containsi:search}}}
      //       //   ]
      //       // },
      //       populate:{
      //         industry:{
      //             // select:["name"]
      //         },
      //         featuredImage:{
      //           select: ["alternativeText", "url"]
      //         },
      //       }
      //     }
      //   }
      // })

      let buckets = await strapi.entityService.findMany("api::bucket.bucket",{
        filters:bucketSearchQuery,
        fields:["name","slug","capsuleplus"],
        populate:{
              companies:{
                fields:["id","name","slug","title","about","capsuleplus"],
                filters:{
                  $or:[

                    {name:{$containsi:search}},
                    {about:{$containsi:search}},
                    {title:{$containsi:search}},
                    {slug:{$containsi:search}},
                    {industry:{name:{$containsi:search}}},
                    {industry:{description:{$containsi:search}}}
                  ]
                },
                populate:{
                  featuredImage:{
                    fields: ["alternativeText", "url"]
                  },
                }
              }
            }
      })

      resData.capsuleplus=companies;
      

      if(ipos.length>0){
        for (const item of ipos) {
          iposCount+=1
          
          resData.ipoZone.push(item.company)
        }
      }

      let bucketData=[]

      if(buckets.length>0){
        for (let i = 0; i < buckets.length; i++) {
          let len = buckets[i].companies.length
          for (let j = 0; j < len; j++) {
            bucketCount+=1;
            buckets[i]["companies"][j]["url"] =`${buckets[i].slug}/${buckets[i]["companies"][j]["slug"]}` 
            bucketData.push(buckets[i]["companies"][j])
            
          }
          
        }
      }
      resData.screener=bucketData;

      totalCount = capsuleplusCount+iposCount+bucketCount;

        return ctx.send({
          success:true,
          message:`Search Result for ${search}`,
          count:totalCount,
          data:resData
        })
    

    } catch (err) {
      return ctx.badRequest(err)
    }
  }
};
