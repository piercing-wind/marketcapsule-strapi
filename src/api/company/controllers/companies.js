module.exports = {
    list: async (ctx) => {
        try {
            let capsuleplusUser = false;

            if (ctx.state && ctx.state.user) {
                capsuleplusUser = ctx.state.user.capsuleplus;
            }

            let { limit, page, bucketId, companyTypeId, pe, marketCap, sectorId, industryId,pageName,companyName,sort } = ctx.request.query
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
            if (sectorId) {
                sectorId = parseInt(sectorId)
                whereQuery["sector"] = {
                    id: sectorId
                }
            }
            if (industryId) {
                industryId = parseInt(industryId);
                whereQuery["industry"] = {
                    id: industryId
                }
            }
            if(companyName){
                whereQuery.name = {$containsi:companyName}
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

            if(companies.length>0){
                if(sort==="lowHighMarketCap"){
                    companies.sort((a,b)=>a.company_share_detail?.marketCap-b.company_share_detail?.marketCap)
                }
                if(sort==="highLowMarketCap"){
                    companies.sort((a,b)=>b.company_share_detail?.marketCap-a.company_share_detail?.marketCap)
                }
                if(sort==="lowHighTTMPE"){
                    companies.sort((a,b)=>a.company_share_detail?.ttpmPE-b.company_share_detail?.ttpmPE)
                }
                if(sort==="highLowTTMPE"){
                    companies.sort((a,b)=>b.company_share_detail?.ttpmPE-a.company_share_detail?.ttpmPE)
                }
            }


            return ctx.response.send({
                success: true,
                message: "success",
                count,
                capsuleplus:pageName==="capsuleplus"?capsuleplusUser?false:true:true,
                data: companies,
            })



        } catch (error) {
            return ctx.badRequest(error)
        }
    },
    detail: async (ctx) => {
        try {

            let capsuleplusUser = false;

            if (ctx.state && ctx.state.user) {
                capsuleplusUser = ctx.state.user.capsuleplus;
            }



            let { slug,name, id, pageName, capsuleplus} = ctx.request.query;
            console.log("capsuleplus",capsuleplus);
            console.log("capsuleplusUser",capsuleplusUser)

            let whereQuery = {
                ...(slug && { slug }),
                ...(id && { id }),
                ...(name &&{name})
            }

            let select = ["name", "websiteUrl", "productDetail", "capsuleplus"]
            let populate = {}
            if (pageName === "bucket-company-detail") {
                let obj = {
                    compnay_timelines: true,
                    sector: {
                        select: ["name"]
                    },
                    industry: {
                        select: ["name", "slug"]
                    },
                    company_share_detail: {
                        select: ["prevClosePrice", "marketCap", "sectoralPERange", "BSE", "ttpmPE", "peRemark"]
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
                if ((!capsuleplus) || (capsuleplus==="true" && capsuleplusUser)) {
                    console.log('false===');
                    let obj = {
                        business_segments: true,
                        company_share_detail: {
                            select: ["marketCap", "peRatio", "rociPercent", "roePercent", "roePercent", "currentPrice", "deRatio", "cwip", "cashConversionCycle", "pegRatio"]
                        },
                        featuredImage: {
                            select: ["alternativeText", "url"]
                        },
                        logo: {
                            select: ["alternativeText", "url"]
                        },
                        industry: {
                            select: ["industrialOutlook", "name", "slug"]
                        },
                        share_holding: true,
                        financial_highlight: true
                    }
                    populate = { ...populate, ...obj }
                    select.push("aboutTheCompany", "keyHighlights", "capsuleView")
                }
                else {
                    let obj = {
                        business_segments: true,
                        company_share_detail: {
                            select: ["marketCap", "peRatio", "rociPercent", "roePercent", "roePercent", "currentPrice", "deRatio", "cwip", "cashConversionCycle", "pegRatio"]
                        },
                        featuredImage: {
                            select: ["alternativeText", "url"]
                        },
                        logo: {
                            select: ["alternativeText", "url"]
                        },
                    }
                    populate = { ...populate, ...obj }
                    select.push("aboutTheCompany")
                }

            }
            let isPrice = false;
            let prices;

            if (pageName === "capsuleplus-company-detail") {
                if ((!capsuleplus) || (capsuleplus==="true" && capsuleplusUser)) {
                    isPrice = true;
                    let obj = {
                        company_share_detail: {
                            select: ["marketCap", "BSE", "ttpmPE", "prevClosePrice", "sectoralPERange", "peRemark"]
                        },
                        featuredImage: {
                            select: ["alternativeText", "url"]
                        },
                        logo: {
                            select: ["alternativeText", "url"]
                        },
                        sector: {
                            select: ["name"]
                        },
                        industry: {
                            select: ["name", "slug"]
                        },
                        operation_detail: true
                    }
                    populate = { ...populate, ...obj }
                    select.push("businessOverview", "otherDetails");
                    // load share pricess of company...
                    let company = await strapi.db.query("api::company.company").findOne({ where: whereQuery, select: ["id"] })
                    prices = await strapi.db.query("api::company-share-price.company-share-price").findMany({
                        where: {
                            companyId: company.id
                        },
                    })
                }
                else {
                    let obj = {

                        featuredImage: {
                            select: ["alternativeText", "url"]
                        },
                        logo: {
                            select: ["alternativeText", "url"]
                        },
                        sector: {
                            select: ["name"]
                        },
                        industry: {
                            select: ["name", "slug"]
                        },
                    }
                    populate = { ...populate, ...obj }
                    select.push("businessOverview");
                }
            }



            let company = await strapi.db.query("api::company.company").findOne({
                where: whereQuery,
                select: select,
                populate: populate,

            })
            company = !isPrice ? company : { ...company, ...{ prices: prices } }

            if(company && company.company_share_detail && company.sector?.name){
                company.company_share_detail.sector = company.sector.name;
            }

            return ctx.response.send({
                success: true,
                message: "Detail fetched",
                capsuleplus: capsuleplus? !capsuleplusUser?true:false:false,
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