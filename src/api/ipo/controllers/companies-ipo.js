const moment = require('moment');

module.exports = {
    list: async (ctx) => {
        try {
            

            let { page, limit, companyTypeId, sectorId, industryId, companyName } = ctx.request.query;

            console.log("payload", ctx.request.query)

            limit = parseInt(limit) || 10;
            page = parseInt(page) || 1;

            let offset = (page - 1) * limit;

            let whereQuery = {}


            if (Array.isArray(companyTypeId) && companyTypeId.length > 0) {
                whereQuery["companyType"] = {id: { $in: companyTypeId.map(i => parseInt(i))}}
            }




            if (Array.isArray(sectorId) && sectorId.length > 0) {
                whereQuery["sector"] = {id: { $in: sectorId.map(i => parseInt(i))}}
            }


            if (Array.isArray(industryId) && industryId.length > 0) {
                whereQuery["industry"] = {id: { $in: industryId.map(i => parseInt(i))}}
                             
            }



            if (Array.isArray(companyName) && companyName.length > 0) {
                whereQuery['companyName'] = {$in:companyName}

            }

            console.log("whereQuery", whereQuery)
            let ipos = await strapi.db.query("api::ipo.ipo").findMany({
                where: whereQuery,
                populate: {
                    company: {
                        populate: {
                            sector: true,
                            company_type: true,
                            industry: true,
                        }
                    },
                    industry: true
                },
                offset: offset,
                limit: limit,
                orderBy: { createdAt: 'desc', updatedAt: 'desc' }
            })
            
            let count = await strapi.db.query("api::ipo.ipo").count({ where: whereQuery });

            let data = [];

            if (ipos.length > 0) {

                for (const item of ipos) {
                    let obj = {
                        id:item.id,
                        companyName: item.companyName,
                        slug: item.slug,
                        openDate: moment(item.openDate).format("MMM Do YYYY"),
                        offerPricePe: item.offerPricePe,
                        lastYearSaleGrowth: item.lastYearSalesGrowth,
                        industry: item.industry?.name,
                    }
                    data.push(obj)
                }
            }



            return ctx.response.send({
                success: true,
                message: "Success",
                count: count,
                data: data
            })

        } catch (err) {
            console.log(err);
            return ctx.badRequest(err)
        }
    },
    detail: async (ctx) => {
        try {
            const { slug } = ctx.request.params;

            const ipoDetail = await strapi.db.query("api::ipo.ipo").findOne({
                where: { slug: slug },
                populate: {
                    company: {
                        select: ["id", "slug", "name"]
                    },
                    industry: {
                        select: ["id", "industrialOutlook", "name"]
                    },
                    logo: {
                        select: ["alternativeText", "url"]
                    }
                }
            })
            if (!ipoDetail) {
                return ctx.badRequest("Detail not found!")
            }

            return ctx.response.send({
                success: true,
                message: "Data Fetched!",
                data: ipoDetail
            })

        } catch (error) {
            console.log("error", error);
            return ctx.badRequest(error)
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

            let companies = await strapi.db.query("api::ipo.ipo").findMany({ select: ["id", "companyName", "slug"] })


            filters[3]["detail"] = companies.map((company)=>{
                return {
                    id:company.id,
                    name:company.companyName,
                    slug:company.slug
                }
            }).filter(i=> i.name);


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