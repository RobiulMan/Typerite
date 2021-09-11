const authRoute = require('./authRoute');
const dashbordRoute = require('./dashbordRoute');
const uploadRoute = require('./uploadRoute');
const postRoute = require('./postRoute');
const allPostsRouter = require('./allPostRouter');
const editPostRouter = require('./editPostRouter');
const postViewRouter = require('./postViewRouter');
const apiRouter = require('../api/Route/apiRouter');
const searchsRoute = require('./searchsRoute');
const homeRouter = require('./homeRouter');
const authorRouter = require('./authorRouter');
const categorisRouter = require('./categorisRouter');

// all router path and handler objects
const routes = [
    {
        path: '/auth',
        handler: authRoute
    },
    {
        path: '/dashbord',
        handler: dashbordRoute
    },
    {
        path: '/upload',
        handler: uploadRoute
    },
    {
        path: '/addpost',
        handler: postRoute
    },
    {
        path: '/post',
        handler: editPostRouter
    },
    {
        path: '/posts',
        handler: allPostsRouter
    },
    {
        path: '/',
        handler: homeRouter
    },
    {
        path: '/author',
        handler: authorRouter
    },
    {
        path: '/api',
        handler: apiRouter
    },
    {
        path: '/post-view',
        handler: postViewRouter
    },
    {
        path: '/searchs',
        handler: searchsRoute
    },
    {
        path: '/categories',
        handler: categorisRouter
    },
    {
        path: '/home',
        handler: homeRouter
    }
];
const setRoutes = (app) => {
    routes.forEach((r) => {
        if (r.path === '/') {
            app.get(r.path, r.handler);
        } else {
            app.use(r.path, r.handler);
        }
    });
};

module.exports = setRoutes;
