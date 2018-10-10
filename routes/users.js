const express = require('express'),
      router = express.Router(),
      verifyJwtToken = require('./../libs/checktoken');


/* GET users listing. */
router.post('/',function(req,res,next){
      console.log(req.cookies.token);
      if(req.cookies.token != undefined) {
        console.log("dans cookie présent");
        verifyJwtToken(req.cookies.token)
        .then((decodedToken) =>
        {
            console.log("dans décoded token");
            const {name,role} = decodedToken;
            const response = {
              "logged" : req.cookies.token,
              "titre" : role,
              "nom" : name, 
          };
          res.status(200).json(response);
          
        })
        .catch((err) =>
        {
          console.log("dans erreur");
          res.status(400).send("error");
        })
    }
});

/*router.get('/', function(req, res, next) {
  console.log("dans get ------------");
  console.log(res.cookies);
  console.log(req.signedCookies)
   const response = {
      "logged" : "token",
      "titre" : "titre bidon",
      "nom" : "lara croft", 
   };
   res.status(200).json(response);
});*/

module.exports = router;
