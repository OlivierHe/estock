const express = require('express'),
      router = express.Router(),
      bcrypt = require('bcryptjs'),
      MongoClient = require('mongodb').MongoClient,
      config = require('./../config/config'),
      tokenList = {},
      cookie = require('cookie'),
      {sign} = require('jsonwebtoken');



function error(res, status = 400) {
    res.sendStatus(status);  
}

/* POST profile page. */
router.post('/', (req, res, next) => {
    // verifie si la requete est une application/json

    if (req.is('application/json')) {
        const {user, password} = req.body;
        if(user === undefined || password === undefined ){
            return error(res); 
        }else if ((user.length >= 2 && user.length <= 100) && (password.length >= 2 && password.length <= 100) ){
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
        }else{
          return error(res); 
        }

      }else{
        error(res);
      }
   
});

module.exports = router;
