module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/subscription/list',
            handler: 'user-subscription.list',

        },
        {
            method: 'GET',
            path: '/subscription/get',
            handler: 'user-subscription.getSubscription',

        },
    ],
};
