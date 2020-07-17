const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.get('/api', (req, res) => res.json({
    message: 'Hello World',
}));

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created... ',
                authData: authData
            })
        }
    });
});



app.post('/api/login', (req, res) => {
    // Mock User
    const user = {
        id: 1,
        username: 'amka',
        email: 'amka@example.com'
    }

    jwt.sign({user:user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
        res.json({token:token});
    });
});

// FORMAT TOKEN
// Authorization: Bearer <access_token>

// Middleware function 
function verifyToken(req, res, next){
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    }else{
        // Forbidden response
        res.sendStatus(403);
    }


}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running on port', PORT));
