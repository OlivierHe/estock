const {verify} = require('jsonwebtoken'),
       config = require('./../config/config');

module.exports = function verifyJwtToken(token) 
{
  return new Promise((resolve, reject) =>
  {
    verify(token, config.secret, (err, decodedToken) => 
    {
      if (err || !decodedToken)
      {
        return reject(err)
      }
      resolve(decodedToken)
    })
  })
};


