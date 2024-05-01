const moment = require('moment');

module.exports = {
    list: async (ctx) => {
        try {

            let { page, limit, companyTypeId, sectorId, industryId } = ctx.request.query;
            limit = parseInt(limit) || 10;
            page = parseInt(page) || 1;

            let offset = (page - 1) * limit;

            let whereQuery = {}


            if (companyTypeId) {
                companyTypeId = parseInt(companyTypeId)
                whereQuery["company"] = {...whereQuery["company"],...{
                    company_type: {
                        id: companyTypeId
                    }
                }}
              
            }
            if (sectorId) {
                sectorId = parseInt(sectorId);
                whereQuery["company"] ={...whereQuery["company"],... {
                    sector: {
                        id: sectorId
                    }
                }}
            }
            if (industryId) {
                industryId = parseInt(industryId);
                whereQuery["company"] = {...whereQuery["company"],...{
                    industry: {
                        id: industryId
                    }
                }}
            }

            console.log("whereQuery",whereQuery)
            let ipos = await strapi.db.query("api::ipo.ipo").findMany({
                where: whereQuery,
                populate: {
                    company: {
                        populate: {
                            sector: true,
                            company_type: true,
                            industry:true,
                        }
                    },
                    industry: true
                },
                offset: offset,
                limit: limit,
                orderBy: { createdAt: 'desc', updatedAt: 'desc' }
            })
            let count = await strapi.db.query("api::ipo.ipo").count({ where: whereQuery });

            let data=[];

            if(ipos.length>0){

                for (const item of ipos) {
                    let obj={
                        companyId:item.company?.id,
                        companyName:item.company?.name,
                        openDate:moment(item.openDate).format("MMM Do YYYY"),
                        offerPricePe:item.offerPricePe,
                        lastYearSaleGrowth:item.lastYearSalesGrowth,
                        industry:item.company?.industry?.name,
                        capsuleplus:item.company?.capsuleplus
                    }
                    data.push(obj)
                }
            }



            return ctx.response.send({
                success: true,
                message:"Success",
                count: count,
                data: data
            })

        } catch (err) {
            console.log(err);
            return ctx.badRequest(err)
        }
    },
    filter: async (ctx) => {
        try {


            let filters = [
                {
                    filterName: "companyTypeId",
                    name: 'Type of SME',
                    type: "checkbox",
                    detail: []
                },
                {
                    filterName: "sectorId",
                    name: 'Sector',
                    type: "checkbox",
                    detail: []
                },
                {
                    filterName: "industryId",
                    name: 'Industry',
                    type: "checkbox",
                    detail: []
                },
                {
                    filterName: "companyName",
                    name: 'Company Name',
                    type: "checkbox",
                    detail: []
                },
            ]

            let companyType = await strapi.db.query("api::company-type.company-type").findMany({ select: ["id", "name", "slug"] })
            filters[0]["detail"] = companyType

            let sectors = await strapi.db.query("api::sector.sector").findMany({ select: ["id", "name", "slug"] });
            filters[1]["detail"] = sectors

            let industries = await strapi.db.query("api::industry.industry").findMany({ select: ["id", "name", "slug"] });
            filters[2]["detail"] = industries;

            let companies = await strapi.db.query("api::company.company").findMany({select:["name"]})

            if(companies.length>0){
                filters[3]["detail"] = companies.map(i=>i.name)
            }

            return ctx.response.send({
                success: true,
                message: "Detail fetched",
                filters
            })

        } catch (err) {
            console.log(err);
            return ctx.badRequest(err)
        }
    },
}