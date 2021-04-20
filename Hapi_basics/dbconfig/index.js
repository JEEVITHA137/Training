const Sequelize = require('sequelize');

const sequelize = new Sequelize('Demo','postgres','postgres',{
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
});

// module.exports.getUsers = async function(){
//     try{
//         await sequelize.authenticate();
//         console.log("connected");
//         const [results,metadata] = await sequelize.query('SELECT * FROM user_details."user"');
//         return results;
//         // console.log(results);
//         // const [results1,metadata1] = await sequelize.query(`UPDATE user_details."user" SET firstname='KIra' WHERE email='Kira78@yahoo.com';`);
//         // console.log(metadata1);
//     }catch(err){
//         console.log("Cannot connected")
//     }
// }
 
// sequelize.authenticate().then(() => {
//     console.log("Connected to server");
// }).catch((err) => {
//     console.log(err);
// })

module.exports.connect = sequelize;