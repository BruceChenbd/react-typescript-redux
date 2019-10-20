module.exports = {
    host:process.env.HOST || '127.0.0.1',
    port:process.env.PORT ||(process.env.NODE_ENV === 'production'?8080:3000),
    apiHost:process.env.APIHOST || 'localhost',
    apiPort:process.env.APIPORT || '6000',
    dbHost:"localhost",
    dbPort:"27017",
    // dbPort: "28001",
    app:{
        title:"personal blog",
        description:'bgg-sys',
        head:{
            titleTemplate:'blog',
            meta:[
                {
                    name:"description",
                    content:"react express demo"
                },
                {charset:"utf-8"}
            ]
        }
    }
};