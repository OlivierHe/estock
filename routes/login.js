const express = require('express'),
      router = express.Router(),
      bcrypt = require('bcryptjs'),
      MongoClient = require('mongodb').MongoClient,
      config = require('./../config/config'),
      tokenList = {},
      cookie = require('cookie'),
      { body,validationResult } = require('express-validator/check'),
      { sanitizeBody } = require('express-validator/filter'),
      {sign} = require('jsonwebtoken');



function error(res, e) {
    res.status(e.status).send(e.message);  
}

async function tokenGen(res, user, role){
    const token = await sign({ name: user, role: role }, config.secret, { expiresIn: config.tokenLife });
    res.cookie('token',token,{encode: String, httpOnly: true});
    res.status(200).send("Connexion réussie");
}

async function mongoConnect(req, res){
    try{
        const {user, password} = req.body;
        console.log("connexion bdd")
        const client = await MongoClient.connect(config.mongodbHost,{ useNewUrlParser: true }).catch(e => {throw {status :"408", message: "Connexion à la bdd impossible"}});
        const db = await client.db('crud_reactjs_node');

        console.log("verif user");
        const results = await db.collection('users').findOne({'user': user});
        if (results === null ) throw {status : "408", message: "Utilisateur inconnu"};

        console.log("bcrypt compare");
        const resp = await bcrypt.compare(password,results.hash);
        if(!resp) throw {status: "403", message: "Hash éronné"} ;
        console.log("token gen");
        tokenGen(res, user, results.role); 
    }catch(e){
        return error(res,e);
    }
        
    

}

/* POST profile page. */
router.post('/',[
    sanitizeBody(["user","password"]).escape(),
    body(["user","password"]).not().isEmpty().isLength({min : 2, max : 100})
    ], (req, res, next) => {

        try {
            // verif type de requête
            if (req.is("application/json")!=="application/json") throw "400";
            // verif params
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw "400";
            // connexion à mongodb
            mongoConnect(req, res);

        }catch(e){
            return error(res,e);
        }        
/*

    // req is callback fun 
    new Promise((resolve, reject) => {
        // verification du type de requete
        console.log("type de req")
        req.is("application/json")==="application/json" ? resolve() : reject();
    })
    .then(() => {
        // verification d'erreurs
        console.log("verif erreurs")
        const errors = validationResult(req);
        if (!errors.isEmpty()) {reject()} else { return resolve()};
    })
    .then(() => {
        // Connection a mongo db
        console.log("connexion bdd")
        MongoClient.connect(config.mongodbHost,{ useNewUrlParser: true });
    }) 
    .then((client) => {
        // lecture bdd
        console.log("lecture bdd")
        const db = client.db('crud_reactjs_node');
        const {user, password} = req.body;
        db.collection('users').findOne({'user': user});
    })
    .then((results) => {
        // controle des résultats
        console.log("control des résultats")
        (results !== null) ? resolve(): reject();
    })
    .then((results) => {
        // comparaisons des hash
        console.log("comparaison des hash")
        bcrypt.compare(password,results.hash);
        (resp) ? resolve(): reject();
    })
    .then(()=>{
        // génération et inscription du token 
        const token = sign({ name: user, role: results.role }, config.secret, { expiresIn: config.tokenLife });
        res.cookie('token',token,{encode: String, httpOnly: true});
        res.status(200).send("succes auth");
    })
    .catch(() => {
        return error(res);
    });

*/

    /*
    // verifie si la requete est une application/json
    if (req.is('application/json')) {
        const {user, password} = req.body;
        console.log(user+" "+password);
        // new code here 
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return error(res); 
        }else {
                // connexion à mongo
            MongoClient.connect(config.mongodbHost,{ useNewUrlParser: true }, (err, client)=> {
                if (err) throw err;

                //console.log("Connected successfully to mongodb");
                const db = client.db('crud_reactjs_node');

                db.collection('users').findOne({'user': user}, (findErr, results) => {
                    if (findErr) throw findErr;

                    if (results !== null ) {
                        // results est un objet de résultats
                        bcrypt.compare(password,results.hash, (err, resp)=>{
                            if(resp) {
                                //let key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                                const token = sign({ name: user, role: results.role }, config.secret, { expiresIn: config.tokenLife });
                                //const refreshToken = sign({name: user, role:results.role}, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife});
                                const response = {
                                    "status": "Logged in",
                                    "token": token,
                                }
                                //tokenList[refreshToken] = response;
                                //res.status(200).json(response);
                                //console.log('token is :' + token);
                                res.cookie('token',token,{encode: String, httpOnly: true});
                                res.status(200).send("succes auth");
                            }else {
                                return error(res,401);
                            }

                        });
                    }else{
                        return error(res,401);
                    }
                });
            });  
        }


      }else{
        error(res);
      } 
      */
   
});

module.exports = router;
