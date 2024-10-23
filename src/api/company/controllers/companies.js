module.exports = {
    list: async (ctx) => {
        try {
            console.log("query", ctx.request.query);

            let capsuleplusUser = false;

            if (ctx.state && ctx.state.user) {
                capsuleplusUser = ctx.state.user.capsuleplus;
            }

            let { limit, page, bucketId, bucketSlug, companyTypeId, peLte, peGte, marketCapLte, marketCapGte, sectorId, industryId, companyName, sort, capsuleplus = false } = ctx.request.query;

            limit = parseInt(limit) || 10;
            page = parseInt(page) || 1;

            let offset = (page - 1) * limit;

            let whereQuery = {}

            if (bucketSlug) {
                let bucket = await strapi.db.query("api::bucket.bucket").findOne({ where: { slug: bucketSlug }, select: ["id"] });

                if (bucket) {
                    whereQuery["buckets"] = {
                        id: bucket.id
                    }
                }
            }

            if (bucketId) {
                bucketId = parseInt(bucketId)
                whereQuery["buckets"] = {
                    id: bucketId
                }
            }
            if (Array.isArray(companyTypeId) && companyTypeId.length > 0) {
                whereQuery["company_type"] = {
                    id: { $in: companyTypeId.map(i => parseInt(i)) }
                }
            }



            if (peLte) {
                whereQuery["company_share_detail"] = {
                    ...whereQuery["company_share_detail"], ...{
                        ttpmPE: { $lte: parseInt(peLte) }
                    }
                }

            }

            if (peGte) {

                whereQuery["company_share_detail"] = {
                    ...whereQuery["company_share_detail"], ...{
                        ttpmPE: { $gte: parseInt(peGte) }
                    }
                }

            }

            if (marketCapLte) {
                whereQuery["company_share_detail"] = {
                    ...whereQuery["company_share_detail"], ...{
                        marketCap: { $lte: parseInt(marketCapLte) }
                    }
                }
            }

            if (marketCapGte) {
                whereQuery["company_share_detail"] = {
                    ...whereQuery["company_share_detail"], ...{
                        marketCap: { $gte: parseInt(marketCapGte) }
                    }
                }

            }

            if (Array.isArray(sectorId) && sectorId.length > 0) {
                whereQuery["sector"] = {
                    id: { $in: sectorId.map(i => parseInt(i)) }
                }
            }

            if (Array.isArray(industryId) && industryId.length > 0) {
                whereQuery["industry"] = {
                    id: { $in: industryId.map(i => parseInt(i)) }
                }
            }


            if (Array.isArray(companyName) && companyName.length > 0) {
                whereQuery.name = { $in: companyName }
            }

            console.log("whereQuery", whereQuery);

            const companies = await strapi.db.query("api::company.company").findMany({
                where: whereQuery,
                select: ["name", "slug", "capsuleplus", "metaTitle", "metaDescription", "createdAt", "updatedAt"],
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
                        select: ["id", "slug", "name"],
                        populate: {
                            tag: {
                                select: ["name", "colorHash"]
                            }
                        }
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

            if (companies.length > 0) {
                if (sort === "lowHighMarketCap") {
                    companies.sort((a, b) => a.company_share_detail?.marketCap - b.company_share_detail?.marketCap)
                }
                if (sort === "highLowMarketCap") {
                    companies.sort((a, b) => b.company_share_detail?.marketCap - a.company_share_detail?.marketCap)
                }
                if (sort === "lowHighTTMPE") {
                    companies.sort((a, b) => a.company_share_detail?.ttpmPE - b.company_share_detail?.ttpmPE)
                }
                if (sort === "highLowTTMPE") {
                    companies.sort((a, b) => b.company_share_detail?.ttpmPE - a.company_share_detail?.ttpmPE)
                }
            }


            return ctx.response.send({
                success: true,
                message: "success",
                count,
                capsuleplus: capsuleplus ? !capsuleplusUser ? true : false : false,
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



            let { slug, name, id, pageName, capsuleplus = false } = ctx.request.query;
            console.log("capsuleplus", capsuleplus);
            console.log("capsuleplusUser", capsuleplusUser)

            let whereQuery = {
                ...(slug && { slug }),
                ...(id && { id }),
                ...(name && { name })
            }

            let select = ["name", "websiteUrl", "productDetail", "capsuleplus", "metaTitle", "metaDescription"]
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
                        select: ["prevClosePrice", "marketCap", "sectoralPERange", "BSE", "ttpmPE", "peRemark", "updatedAt"]
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
                if ((capsuleplus !== "true") || (capsuleplus === "true" && capsuleplusUser)) {
                    console.log('false===');
                    let obj = {
                        business_segments: {
                            select: ["title", "description"],
                            populate: {
                                image: {
                                    select: ["alternativeText", "url"]
                                }
                            }
                        },
                        company_share_detail: {
                            select: ["marketCap", "peRatio", "roicPercent", "roePercent", "roePercent", "currentPrice", "deRatio", "cwip", "cashConversionCycle", "pegRatio", "rocePercent"]
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
                        share_holdings: true,
                        financial_highlights: true
                    }
                    populate = { ...populate, ...obj }
                    select.push("aboutTheCompany", "keyHighlights", "capsuleView")
                }
                else {
                    let obj = {
                        business_segments: true,
                        company_share_detail: {
                            select: ["marketCap", "peRatio", "roicPercent", "roePercent", "roePercent", "currentPrice", "deRatio", "cwip", "cashConversionCycle", "pegRatio", "rocePercent"]
                        },
                        featuredImage: {
                            select: ["alternativeText", "url"]
                        },
                        logo: {
                            select: ["alternativeText", "url"]
                        },
                        industry: {
                            select: ["name", "slug"]
                        },
                    }
                    populate = { ...populate, ...obj }
                    select.push("aboutTheCompany", "capsuleView")
                }

            }
            let isPrice = false;
            let prices;

            if (pageName === "capsuleplus-company-detail") {
                if ((capsuleplus !== "true") || (capsuleplus === "true" && capsuleplusUser)) {
                    isPrice = true;
                    let obj = {
                        business_segments: {
                            select: ["title", "description"],
                            populate: {
                                image: {
                                    select: ["alternativeText", "url"]
                                }
                            }
                        },
                        company_share_detail: {
                            select: ["marketCap", "BSE", "ttpmPE", "prevClosePrice", "sectoralPERange", "peRemark","peRatio", "roicPercent", "roePercent", "roePercent", "currentPrice", "deRatio", "cwip", "cashConversionCycle", "pegRatio", "rocePercent"]
                        },
                        featuredImage: {
                            select: ["alternativeText", "url"]
                        },
                        logo: {
                            // select: ["alternativeText", "url"]
                        },
                        sector: {
                            select: ["name"]
                        },
                        industry: {
                            select: ["name", "slug","industrialOutlook"]
                        },
                        operation_details: true,
                        companyTypeDetails: true,
                        share_holdings: true,
                        financial_highlights: true
                    }
                    populate = { ...populate, ...obj }
                    select.push("businessOverview", "financialReport", "shareCapitalAndEmployees","aboutTheCompany", "keyHighlights", "capsuleView");

                    // load share pricess of company...
                    console.log("whereQuery", whereQuery);
                    let company = await strapi.db.query("api::company.company").findOne({ where: whereQuery, select: ["id"] });

                    prices = await strapi.db.query("api::company-share-price.company-share-price").findMany({
                        where: {
                            companyId: company.id
                        },
                    })
                }
                else {
                    let obj = {
                        business_segments: true,
                        company_share_detail: {
                            select: ["marketCap", "peRatio", "roicPercent", "roePercent", "roePercent", "currentPrice", "deRatio", "cwip", "cashConversionCycle", "pegRatio", "rocePercent"]
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
                    }
                    populate = { ...populate, ...obj }
                    select.push("businessOverview","aboutTheCompany", "capsuleView");
                }
            }



            let company = await strapi.db.query("api::company.company").findOne({
                where: whereQuery,
                select: select,
                populate: populate,

            })
            capsuleplus = company ? company.capsuleplus : false;
            company = !isPrice ? company : { ...company, ...{ prices: prices } }

            if (company && company.company_share_detail && company.sector?.name) {
                company.company_share_detail.sector = company.sector.name;
            }

            let isConetentLock = capsuleplus ? !capsuleplusUser ? true : false : false

            return ctx.response.send({
                success: true,
                message: "Detail fetched",
                capsuleplus: isConetentLock,
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

            let companies = await strapi.db.query("api::company.company").findMany({ select: ["id", "name", "slug"] })

            if (companies.length > 0) {
                filters[3]["detail"] = companies
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
    search: async (ctx) => {
        try {

            let { search, limit, page } = ctx.request.query;
            limit = parseInt(limit) || 20;
            page = parseInt(page) || 1;

            let offset = (page - 1) * limit;
            let searchQuery = {}

            if (search) {
                searchQuery = {
                    $or: [
                        {
                            name: { $containsi: search }
                        },
                        {
                            about: { $containsi: search }
                        },
                        {
                            slug: { $containsi: search }
                        },
                        {
                            title: { $containsi: search }
                        },
                        {
                            industry: {
                                name: { $containsi: search }
                            }
                        },
                    ],

                }
            }

            let companies = await strapi.db.query("api::company.company").findMany({
                where: searchQuery,
                select: ["name"],
                populate: {
                    indsutry: {
                        select: ["name"]
                    }
                },
                limit: limit,
                offset: offset
            })

            return ctx.send({
                success: true,
                message: "Success",
                data: companies
            })

        } catch (error) {
            return ctx.badRequest(error)
        }
    },
    priceAndVolume: async (ctx) => {
        try {
            const { companySlug } = ctx.request.query;

            let companyId;
            if (!companySlug) {
                return ctx.badRequest("CompanySlug is missing")
            }

            if (companySlug) {

                let company = await strapi.db.query("api::company.company").findOne({ where: { slug: companySlug }, select: ["id"] });

                if (!company) {
                    return ctx.badRequest("Invalid company slug!")
                }
                companyId = company.id;
            }

            let todayDate = new Date();
            let endDate = new Date(todayDate.getFullYear() - 1, todayDate.getMonth(), todayDate.getDate());



            let searchQuery = {
                companyId: companyId,
                $and: [
                    {
                        date: { $gte: new Date(endDate) }
                    },
                    {
                        date: { $lte: new Date(todayDate) }
                    }
                ]
            }


            let data = await strapi.db.query("api::company-share-price.company-share-price").findMany({
                where: searchQuery,
                orderBy: { date: 'desc' }
            })


            let volumes = await getData(data);


            return ctx.send({
                success: true,
                message: "Data fetched",
                data: volumes
            })

        } catch (error) {
            return ctx.badRequest(error)
        }
    }
}

async function getData(arr) {
    let map = new Map();
    let res = []
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    for (let item of arr) {
        let date = new Date(item.date)
        let monthName = month[date.getMonth()];
        let year = date.getFullYear();
        let str = `${monthName}-${year}`;
        if (map.has(str)) {
            map.set(str, map.get(str) + item.volume)
        }
        else {

            map.set(str, item.volume)
        }
    }
    let count = 1;
    for (let [key, value] of map) {
        res.push({
            id: count,
            monthAndYear: key,
            volume: value
        })
        count++
    }
    return res

}