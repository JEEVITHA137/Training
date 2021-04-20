const Hapi = require('hapi');

const server = new Hapi.Server();

server.connection({ 
    host: 'localhost',
    port: 1337
});

const add = function (a, b, next) {
    return next(null, a + b);
};

server.method('add', add);

server.methods.add(1, 2, (err, result) => {
    console.log(result)
});

server.register(require('hapi-auth-basic'));
    
server.auth.strategy('login','basic',{
    
    validateFunc: async function(request,username,password,h){
        const user = users[username];

        if(!user){
            return { isValid: false}
        }
        
    
        if(user.password == password){
            return { isValid: true, credential: {id: user.id, name: user.username}};
        }
        else{
            return { isValid: false }
        }
    }
});


const users = {
    Jeevi:{
        id:1,
        username: "Jeevitha",
        password: "123"
    },
    Sakthi:{
        id:3,
        username: "Sakthi",
        password: "456"
    },
}

const scheme = function (server, options) {

    return {
        api: {
            settings: {
                x: 5
            }
        },
        authenticate: function (request, reply) {

            const req = request.raw.req;
            const authorization = req.headers.authorization;
            if (!authorization) {
                return reply(Boom.unauthorized(null, 'Custom'));
            }

            return reply.continue({ credentials: { user: 'john' } });
        }
    };
};

server.auth.scheme('custom', scheme);
server.auth.strategy('default', 'custom');
console.log(server.auth.api.default.settings.x); 
server.auth.default('default');


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        return reply(request.auth.credentials.user);
    }
});

server.route([
    {
        method: 'GET',
        path: '/home',
        config: {
            handler: (request, reply) => {

                return reply("<h1>Hi</h1>")
            }
        }
}
])

server.start(function(){
    console.log("Server Running",server.info.uri)
})