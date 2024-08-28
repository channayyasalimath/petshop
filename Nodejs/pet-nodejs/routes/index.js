const indexModule = require ("../model")({})
const jwt = require('jsonwebtoken');

const multer = require("multer")
module.exports = function (routers, expressApp){

// -----------------------------------login----------------------------------------
routers.post('/login', indexModule.login);


function authenticateToken(req, res, next){
    
     const authHeader = req.headers['authorization']
     console.log(authHeader);
     const token = authHeader && authHeader.split(' ')[1]

     if (token == null)
     return res.sendStatus(401)

     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err)
        return res.sendStatus(403)

        req.user = user
        next()
     })
}



    routers.post('/registration', indexModule.registration);
    

// -----------------------------------Category----------------------------------------
    routers.post("/getCategory", indexModule.getCategory);

    routers.post ("/getCategoryById", indexModule.getCategoryById);

    routers.post ("/getProductsByCategoryId", indexModule.getProductsByCategoryId);

    routers.post("/postCategory", indexModule.postCategory);

    routers.post("/updateCategory", indexModule.updateCategory);

    routers.post("/deleteCategory", indexModule.deleteCategory);

// -----------------------------------pet products----------------------------------------

    routers.post("/getProducts", indexModule.getProducts);

    routers.post("/getProductById", indexModule.getProductById);

    routers.post("/getProductsBySellerId", indexModule.getProductsBySellerId);

    routers.post("/postProduct", indexModule.postProduct);

    routers.post("/updateProduct", indexModule.updateProduct);

    routers.post("/updateProductStatus", indexModule.updateProductStatus);

    routers.post("/deleteProduct", indexModule.deleteProduct);


// -----------------------pet order-------------------------------------------------------

   // routers.post("/addToCart",authenticateToken,indexModule.addToCart);
    routers.post("/addToCart",indexModule.addToCart);

    routers.post("/deleteFromCart",indexModule.deleteFromCart);

    routers.post('/deleteallcartitem', indexModule.deleteAllCartItems);

	routers.post('/cartitems', indexModule.cartitems);

    routers.post('/cart/check',indexModule.productavailcheck);
    
    routers.post("/addOrder", indexModule.addOrder);

    routers.post("/shippingAddress", indexModule.shippingaddress);

    routers.post("/getOrder", indexModule.getOrder);

    routers.post("/getSellerOrder", indexModule.getSellerOrder);

    routers.post("/getOrderById", indexModule.getOrderById);

    const upload = multer({ dest: '../public/assets' })
   
    routers.post('/upload',indexModule.uploadProductImage);
   


    routers.post("/postOrder", indexModule.postOrder);

    routers.post("/updateOrder", indexModule.updateOrder);

    routers.post("/deleteOrder", indexModule.deleteOrder);

    return routers;
}