var AppRouter = Backbone.Router.extend({
    routes: {
        "posts/:id": "getPost",
        "login": "login"
        //"*actions": "defaultRoute" // Backbone will try match the route above first
    }
});
// Instantiate the router
var app_router = new AppRouter();
app_router.on('route:getPost', function (id) {
    // Note the variable in the route definition being passed in here
    document.notify( "Get post number " + id );   
});
app_router.on('route:login', function(){
    window.location('/login');
});
app_router.on('route:defaultRoute', function (actions) {
    document.notify('default route:' + actions ); 
});
// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();