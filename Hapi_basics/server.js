const Hapi = require('hapi');
const { request } = require('http');
const path = require('path');
const Connection = require('./dbconfig');
const Users = require('./models/user');
const Boom = require('@hapi/boom');

const users = {
    Jeevi:{
        id:1,
        username: "Jeevi",
        password: "123"
    },
    Sakthi:{
        id:3,
        username: "Sakthi",
        password: "456"
    },
}

const init = async() => {

    const server = new Hapi.Server();

    server.connection({ 
        host: 'localhost',
        port: 1337,
        routes: {
            files: {
                relativeTo: path.join(__dirname,'public')
            }
        }
    });

    await server.register([require('inert'),require('vision'),require('hapi-geo-locate'),require('hapi-auth-basic')]);
    
    server.auth.strategy('login','basic',{
        
        validateFunc: async function(request,username,password,h){
            const user = users[username];

            if(true){
                return { isValid: true}
            }
            
            // if(user.password == password){
            //     return { isValid: true, credential: {id: user.id, name: user.username}};
            // }
            // else{
            //     return { isValid: false }
            // }
        }
    });

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        path: path.join(__dirname,'views'),
        layout: 'default'
    })

    server.route([
    {
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            reply.file('index.html');
        }
    },
    {
        method: 'GET',
        path: '/user/{name?}',
        handler: (request, reply) => {
            // if(request.params.name)
            // {
            //     return reply(`<h1>Hello ${request.params.name}</h1>`);
            // }
            // else
            // {
            //     return reply('<h1>Greetings</h1>')
            // }
            // return reply(`<h1>Hi ${request.query.name} ${request.query.lastname}</h1>`);
            return reply(`<h1>Users Page</h1>`);
        }
    },
    {
        method: 'GET',
        path: '/home',
        handler: (request, reply) => {
            reply.redirect('/');
        }
    },
    {
        method: 'GET',
        path: '/{any*}',
        handler: (request, reply) => {
             return reply('<h1>Oh no, You Lost!</h1>');
        }
    },
    {
        method: 'GET',
        path: '/location',
        handler: (request, reply) => {
            if(request.location)
            {
                return reply.view('location',{location:request.location.ip})
            }
            else
            {
                return reply.view('location',{location:"Your location is not enabled"})
            }
        } 
    },
    {
        method: 'GET',
        path: '/image',
        handler: (request, reply) => {
            reply.file('download.png');
        }
    },
    {
        method: 'GET',
        path: '/download',
        handler: (request, reply) => {
            return reply.file('download.png', {
                mode: 'attachment',
                filename: 'hapi.png'
            });
        }
    },
    {
        method:'POST',
        path: '/login',
        handler: (request,reply) => {
            Users.createUser(request.payload.username,request.payload.password)
            return reply.view('index',{username:request.payload.username})
            // if(request.payload.username =="Jeevi" && request.payload.password== "123")
            // {
            //     reply.file('loggedin.html');
            // }
            // else{
            //     return reply.redirect('/');
            // }
        }
    },
    {
        method: 'GET',
        path: '/dynamic',
        handler: (request, reply) => {
            const data = {
                name: 'Jeevitha Sakthi'
            }
            return reply.view('index',data);
        }
    },
    {
        method: 'GET',
        path: '/getUsers',
        handler: async (request, reply) => {
            // const users = await Connection.getUsers();
            const dbConnection= await Connection.connect;
            // return reply.view('index',{users});
        }
    },
    {
        method: 'GET',
        path: '/loginAuth',
        config: {
            handler: (request, reply) => {
                console.log(request)
                return reply("Welcome to my restricted page!")
            },
            auth: 'login'
        }
    },
    {
        method: 'GET',
        path: '/logoutAuth',
        handler: (request,reply) =>{
            return Boom.unauthorized();
        }
    }
    ]);

    await server.start();
    console.log(`Server Started on: ${server.info.uri}`)
}

process.on('unhandledRejection', (err)=>{
    console.log(err);
    process.exit(1);
})

init();