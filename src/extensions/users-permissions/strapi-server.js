module.exports = (plugin) =>{ 

    plugin.controllers.user.updateMe  = async (ctx) => {
        
        if(!ctx.state.user || !ctx.state.user.id){
            return ctx.badRequest("Please login first")
        }
        let {email} = ctx.request.body;

        if(!email==undefined  || !email ==null){
            return ctx.badRequest("Email update is not allowed here")
        }

        await strapi.query('plugin::users-permissions.user').update({
            where:{
                id:ctx.state.user.id
            },
            data:ctx.request.body
        }).then(()=>{
            return ctx.response.send({
                success:true,
                message:"Profile update successfully"
            })
        })
      
    
    }




    plugin.routes['content-api'].routes.push({

        method: "PUT",
        path: "/user/me",
        handler: "user.updateMe",
        config: {
            prefix: "",
            policies: []
        }
    });


    return plugin;

}