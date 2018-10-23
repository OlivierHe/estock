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
            // connexion à mongodb async
            mongoConnect(req, res);
        }catch(e){
            return error(res,e);
        }        
   
});

module.exports = router;
