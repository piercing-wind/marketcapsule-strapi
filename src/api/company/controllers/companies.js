module.exports = {
    list: async (ctx) => {
        try {

            let { limit, page, bucketId, companyTypeId, pe, marketCap, sectorId ,industryId} = ctx.request.query
            console.log(ctx.request.query);
            limit = parseInt(limit) || 10;
            page = parseInt(page) || 1;

            let offset = (page - 1) * limit;

            let whereQuery = {}


            if (bucketId) {
                bucketId = parseInt(bucketId)
                whereQuery["buckets"] = {
                    id: bucketId
                }
            }

            if (companyTypeId) {
                companyTypeId = parseInt(companyTypeId)
                whereQuery["company_type"] = {
                    id: companyTypeId
                }
            }
            if (pe && pe.lte) {
                whereQuery["company_share_detail"] = {
                    peRatio: { $lte: pe.lte }
                }
            }
            if (marketCap && marketCap.gte) {
                whereQuery["company_share_detail"] = {
                    marketCap: { $gte: marketCap.gte }
                }
            }

            if (marketCap && marketCap.lte) {
                whereQuery["company_share_detail"] = {
                    marketCap: { $lte: marketCap.lte }
                }
            }

            if (pe && pe.gte) {
                whereQuery["company_share_detail"] = {
                    peRatio: { $gte: pe.gte }
                }
            }
            if(sectorId){
                sectorId=parseInt(sectorId)
                whereQuery["sector"]={
                    id:sectorId
                }
            }
            if(industryId){
                industryId = parseInt(industryId);
                whereQuery["industry"]={
                    id:industryId
                }
            }

            const companies = await strapi.db.query("api::company.company").findMany({
                where: whereQuery,
                select: ["name", "slug", "capsuleplus"],
                populate: {
                    company_share_detail: {
                        select: ["marketCap", "ttpmPE"]
                    },
                    company_type: {
                        select: ["id", "slug"]
                    },
                    buckets: {
                        select: ["id", "slug"]
                    },
                    industry: {
                        select: ["id", "slug", "name"]
                    },
                    sector: {
                        select: ["id", "name", "slug"]
                    },
                    featuredImage: {
                        select: ["alternativeText", "url"]
                    }
                },
                offset: offset,
                limit: limit,
                orderBy: { createdAt: 'desc', updatedAt: 'desc' }
            })

            const count = await strapi.db.query("api::company.company").count({
                where: whereQuery,
                populate: {
                    company_type: true,
                    buckets: true
                },
            })


            return ctx.response.send({
                success: true,
                message: "success",
                count,
                data: companies,
            })



        } catch (error) {
            return ctx.badRequest(error)
        }
    },
    detail: async (ctx) => {
        try {
            console.log("1234567");

            let { slug, id, pageName } = ctx.request.query

            let whereQuery = {
                ...(slug && { slug }),
                ...(id && { id })
            }

            let select = ["name", "websiteUrl", "productDetail", "capsuleplus"]
            let populate = {}
            if (pageName === "bucket-company-detail") {
                let obj = {
                    compnay_timeline: true,
                    sector:{
                        select:["name"]
                    },
                    company_share_detail: {
                        select:["prevClosePrice","marketCap","sectoralPERange","BSE","ttpmPE","peRemark"]
                    },
                    featuredImage: {
                        select: ["alternativeText", "url"]
                    },
                    logo: {
                        select: ["alternativeText", "url"]
                    },
                }
                populate = { ...populate, ...obj }
                select.push("about")
            }

            if (pageName === "ipo-company-detail") {
                let obj = {
                    business_segments: true,
                    company_share_detail: {
                        select:["marketCap","peRatio","rociPercent","roePercent","roePercent","currentPrice","deRatio","cwip","cashConversionCycle","pegRatio"]
                    },
                    featuredImage: {
                        select: ["alternativeText", "url"]
                    },
                    logo: {
                        select: ["alternativeText", "url"]
                    },
                    industry: {
                        select:["industrialOutlook"]
                    },
                    share_holding: true,
                    financial_highlight: true
                }
                populate = { ...populate, ...obj }
                select.push("aboutTheCompany", "keyHighlights", "capsuleView")
            }
            let isPrice=false;
            let prices;

            if(pageName==="capsuleplus-company-detail"){
                isPrice=true;
                let obj = {
                    company_share_detail: {
                        select:["marketCap","BSE","ttpmPE","prevClosePrice","sectoralPERange","peRemark"]
                    },
                    featuredImage: {
                        select: ["alternativeText", "url"]
                    },
                    logo: {
                        select: ["alternativeText", "url"]
                    },
                    sector: {
                        select:["name"]
                    },
                    operation_detail:true
                }
                populate = { ...populate, ...obj }
                select.push("businessOverview","otherDetails");

                // load share pricess of company...
                let company = await strapi.db.query("api::company.company").findOne({where:whereQuery,select:["id"]})
                prices = await strapi.db.query("api::company-share-price.company-share-price").findMany({
                    where:{
                        companyId:company.id
                    },
                })

                console.log("prices",prices)

            }

            
            
            let company = await strapi.db.query("api::company.company").findOne({
                where: whereQuery,
                select: select,
                populate: populate
            })
            company = !isPrice?company:{...company,...{prices:prices}}

            return ctx.response.send({
                success: true,
                message: "Detail fetched",
                data: company
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
            ]

            let companyType = await strapi.db.query("api::company-type.company-type").findMany({ select: ["id", "name", "slug"] })
            filters[0]["detail"] = companyType

            let sectors = await strapi.db.query("api::sector.sector").findMany({ select: ["id", "name", "slug"] });
            filters[1]["detail"] = sectors

            let industries = await strapi.db.query("api::industry.industry").findMany({ select: ["id", "name", "slug"] });
            filters[2]["detail"] = industries;

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