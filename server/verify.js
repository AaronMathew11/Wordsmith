
const jwt = require("jsonwebtoken")

function verify(req, res, next) {

    const token = req.body.token;

    if (token) {

        let decodedToken;
        try {
          
          decodedToken = jwt.verify(token, 'shhhhh');
          console.log("decodedToken+",decodedToken)
            if (decodedToken) {
                req.token = token;
                next()
            }
        }
        catch (e) {

            res.status(200).json({
                data: "Not auth"
            })


        }
    }
    else{
        res.status(200).json({
            data: "Not auth"
        })

    }

}

exports.verify=verify