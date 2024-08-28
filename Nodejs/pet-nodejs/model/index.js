require('dotenv').config()

const backend = require ("../backend")({})
const jwt = require('jsonwebtoken');
var multer = require('multer');
const helper=require('../Helper/imgUploadHelper.js');
const sendEmail=require('../Helper/email.js');

module.exports = function (props){
    return{

// -----------------------login---------------------------------------
        login : login,
        registration : registration,
// -----------------------Category---------------------------------------
        getCategory : getCategory,
        getCategoryById: getCategoryById,
        getProductsByCategoryId: getProductsByCategoryId,
        postCategory : postCategory,
        updateCategory : updateCategory,
        deleteCategory : deleteCategory,
// -----------------------pet Products---------------------------------------
        getProducts: getProducts,
        getProductById: getProductById,
        getProductsBySellerId: getProductsBySellerId,
        postProduct: postProduct,
        updateProduct: updateProduct,
        updateProductStatus: updateProductStatus,        
        deleteProduct: deleteProduct,
// -----------------------pet order---------------------------------------
        addToCart : addToCart,
        deleteFromCart : deleteFromCart,
        deleteAllCartItems : deleteAllCartItems,
        cartitems : cartitems,
        productavailcheck : productavailcheck,
        shippingaddress : shippingaddress,
        addOrder : addOrder,
        getOrder : getOrder,
        getSellerOrder: getSellerOrder,
        getOrderById : getOrderById,

        postOrder : postOrder,
        updateOrder: updateOrder,
        deleteOrder : deleteOrder,

        uploadProductImage : uploadProductImage,

    }
}

// -----------------------upload---------------------------------------


function uploadProductImage(req, res){
    console.log(req.file)
  
    console.log(req.body)
    console.log(req.body);
  
    helper.upload(req,res, function(err){
      
      if(err){
        res.send(JSON.stringify({response:null, error:err,status:500}));
      }else{
        var obj = {
          file: req.files[0].filename,
          status: 200,
          error: null
         }; 
         console.log(obj);
      res.send(obj);
  
  
    /*var options = {
            cater_id:  "3",
            file_path : obj.file,
      
    };
     backend.savecaterprofile(options, function(response){
         res.send(response);
    });
  */
  
      }
         
    });
  };

// -----------------------login---------------------------------------

function login(req, res)
{
    console.log("Login")
    var options = {
        username: req.body.user_name,
        password: req.body.password,
        org_id: "71dedcc6606479dc82e23f3fe1bfb83355935e16"
    };

    backend.getUserFromCredentials(options, function(result){
        if(result.response.length > 0)
         {
            const user = { name : options.username}
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

            const user_id = result.response[0].id;
            const user_type = result.response[0].user_type;

            console.log(accessToken)
            res.send({ accessToken : accessToken , user_id: user_id, user_type: user_type})
         } 
         else
         {
            var result = {
                  response : null,
                  status : 500,
                  access_token : null,
                  error : "Invalid Credentials"         
            };
            console.log(result)
            res.send(result);
         } 
      });
}

function registration(req, res)
{
    console.log("reg")
      var options = {
                       org_id     : "71dedcc6606479dc82e23f3fe1bfb83355935e16",
                       contact_no : req.body.contact_no,
                       full_name  : req.body.full_name,
                       user_name  : req.body.user_name,
                       password   : req.body.password,
                       user_type   : req.body.user_type,
                    };

      backend.getUserAccount(options, function(result){
           if(result.response.length > 0)
           {
                var response = {
                            error: null,
                            status: 500,
                            errorMsg: "User already registered!",
                            response: []
                        };
                        console.log(response.errorMsg)
                res.send(response);
           } 
           else
           {
               backend.registration(options, function(response)
               {
                  if(response.affectedRows > 0)
                  {
                     req.url = '/login';
                     req.method = 'POST';
                     req.app._router.handle(req,res);
                  }
               });
           }
      });          
}


// -----------------------Category---------------------------------------


function getCategory(req, res){
    let payload = req.body;
    backend.getCategory(payload, function (response){
        res.send(response);
    });
}

function getCategoryById(req, res){
    let payload = req.body;
    backend.getCategoryById(payload, function (response){
        res.send(response);
    });
}

function getProductsByCategoryId(req, res){
    let payload = req.body;
    backend.getProductsByCategoryId(payload, function (response){
        res.send(response);
    });
}

function postCategory(req, res){
    let payload = req.body;
    backend.postCategory(payload, function (response){
        res.send(response);
    });
}

function updateCategory(req, res){
    let payload = req.body;
    backend.updateCategory(payload, function (response){
        res.send(response);
    });
}

function deleteCategory(req, res){
    let payload = req.body;
    backend.deleteCategory(payload, function (response){
        res.send(response);
    });
}

// -----------------------pet Products---------------------------------------

function getProducts(req, res){
    let payload = req.body;
    backend.getProducts(payload, function (response){
        res.send(response);
    });
}

function getProductById(req, res){
    let payload = req.body;
    backend.getProductById(payload, function (response){
        res.send(response);
    });
}

function getProductsBySellerId(req, res){
    let payload = req.body;
    backend.getProductsBySellerId(payload, function (response){
        res.send(response);
    });
}

function postProduct(req, res){
    let payload = req.body;
    backend.postProduct(payload, function (response){
        res.send(response);
    });
}

function updateProduct(req, res){
    let payload = req.body;
    backend.updateProduct(payload, function (response){
        res.send(response);
    });
}

function updateProductStatus(req, res){
    let payload = req.body;
    backend.updateProductStatus(payload, function (response){
        res.send(response);
    });
}

function deleteProduct(req, res){
    let payload = req.body;
    backend.deleteProduct(payload, function (response){
        res.send(response);
    });
}
// -----------------------pet order---------------------------------------
function addToCart(req,res){
    let payload = {
            //user_id      : user_id,
            user_id      : req.body.user_id,
            product_id   : req.body.product_id, 
            quantity     : req.body.quantity,
            product_name : req.body.product_name,
            category_id  : req.body.category_id,
            seller_id    : req.body.seller_id,
           
        }   

        backend.getAvailQuantity(payload, function(product_total_quantity){
            payload.product_total_quantity = product_total_quantity;

             if(product_total_quantity >= payload.quantity)
                {                  
                     backend.getCartIdOfUser(payload, function(result){
                        if(result.length == 0)
                         {
                         backend.createCartForCustomer(payload,function(cart_id)
                            {
                                payload.cart_id = cart_id;
                                addItemToCart(payload, function(response)
                                { 
                                res.send(response);
                                });
                            });
                         }
                         else
                         {
                            payload.cart_id = result[0].id;
                            console.log(payload)
                            addItemToCart(payload, function(response)
                            { 
                                res.send(response);
                            });
                         }
                    });
                }  
             else
                {
                    var result = {};
                    result.response = [{ "product_total_quantity" : payload.product_total_quantity }];
                    result.status = 300;
                    result.error = null;
                    res.send(result);
                }
        });
    }


    
// function to add the product to cart
function addItemToCart(options, callback)
{
  backend.checkSameVendorProduct(options, function(result_check)
  {
    if(result_check.length > 0)
    {
       var result = {};
       result.response = [{ cart_id : options.cart_id }];
       result.status = 400;
       result.error = null;
       callback(result);
    }
    else
    {
      backend.checkItemInCart(options,function(result)
      {
       if(result.length > 0)
       {
         options.qty = result[0].quantity + parseInt(options.quantity,10);
         
         if(options.product_total_quantity >= options.qty)
         { 
            backend.cartUpdate(options, function(response)
            {
              callback(response);
            });
         }
         else
         {
            var result = {};
            result.response = [{ "product_total_quantity" : options.product_total_quantity }];
            result.status = 300;
            result.error = null;
            callback(result);
         }  
       }
       else
       {
         backend.insertCartItem(options,function(options)
         {
            callback(options); 
         });
       }
      });
    } 
  });
}
      
function deleteFromCart(req,res){
    let payload = {
        user_id      : req.body.user_id,
        product_id   : req.body.product_id
    }
    removeFromCart(payload, function(response){
            res.send(response);
    });
}

// deleting all the cart items after order is successfully placed
function deleteAllCartItems(req, res)
{
      var options = {
            user_id : req.body.user_id,
            cart_id : req.body.cart_id,
      };
      backend.deleteAllCartItems(options, function(result){
		     result.response = null;
         res.send(result);
      });               
}

function removeFromCart(payload, callback)
{
    backend.getCartIdOfUser(payload, function(result){
        if(result.length > 0)
        {  
            payload.cart_id = result[0].id;
            backend.removeCartItem(payload, function(response)
            {
                    callback(response); 
            });
        }      
       });
}

function cartitems(req, res)
{
   var options = {
           user_id : req.body.user_id,
   };
    
  backend.getCartItems(options, function(cart_items){
    if(cart_items.length > 0)
     {
        //var shipping_amount = 40;
                
                var count=0;
                for(var key in cart_items)
                {
                        backend.getProductImages(cart_items[key],function(result){
                           count++;
                           cart_items[key] = result;
                        
                           if(count == cart_items.length)
                           {
                             var result = {};

                             var response1 = {};
                             response1["products"] = cart_items;
                             response1["shipping_amount"] = cart_items.length > 0 ? 40 : 0;
                             var response_array = [];
                             response_array.push(response1);
                             
                             result.response = response_array;
                             result.status = 200;
                             result.error = null;
                             res.send(result);
                           }
                        });
                } 
            
           //}
        //    else
        //    {
        //        var result = {};
        //        result.response = null;
        //        result.status = 300;
        //        result.error = null;
        //        res.send(result);
        //    }
        //});
     } 
     else
     {
        var result = {};
        result.response = [];
        result.status = 200;
        result.error = null;
        res.send(result);
     }
    
    });
}

function productavailcheck(req, res)
{
     var options = {
                cart_id : req.body.cart_id,
     };
     backend.productavailcheck(options, function(cart_products_list){
      console.log("len : ", cart_products_list.length)
        for(var i=0; i<cart_products_list.length; i++)
        {
            if(cart_products_list[i].quantity > cart_products_list[i].product_total_quantity)
            {
                break;
            }
        }
        if(i == cart_products_list.length)
        {
           var result = {};
           result.response = null;
           result.status = 200;
           result.error = null;
           res.send(result);
        }
        else
        {
           var result = {};
           result.response = [{ "i" : i , "product_total_quantity" : cart_products_list[i].product_total_quantity }];
           result.status = 300;
           result.error = null;
           res.send(result);
        }
     });
   
}



function shippingaddress(req,res){
    let payload = req.body;
    backend.shippingAddress(payload, function(response){

        let options = { 
            email: payload.email,
            message:"Your Order has been placed "
        };

            sendEmail(options);
            res.send(response);
    });
}

function addOrder(req, res)
{
  user_id = req.body.user_id;
      var options = {
         user_id        : user_id,
         cart_id        : req.body.cart_id,
         seller_id       : req.body.seller_id,
         total_price    : req.body.total_price,
         shipping_price : req.body.shipping_price,
         tax_amount     : req.body.tax_amount,
         grand_price    : req.body.grand_price,
      };
	    
      var today = new Date();
      options.day = today.getDate();
      if(options.day.toString().length == 1)
         options.day = '0' + options.day;

      var month = today.getMonth();
      options.month = month + 1;
      if(options.month.toString().length == 1)
         options.month = '0' + options.month;

      options.year = today.getFullYear();
     
      backend.getOrderNumber(options, function(options)
      {
         backend.createOrderRecord(options, function(options)
         {
            backend.getCartProducts(options, function(cart_products_list)
            {
              if(cart_products_list.length > 0)
              {
                 var cart_length = cart_products_list.length;
                 for(var i=0;i<cart_length;i++)
                 {
                    backend.addProductsToOrder(options, cart_products_list[i], function(added_order_response){

                      if(added_order_response.affectedRows > 0)
                      {
                        backend.deleteAllCartItems(options, function(delete_response){
                           if(delete_response.affectedRows > 0)
                           {
                              backend.updateOrderNum(options, function(update_result){
                                if(update_result.affectedRows > 0)
                                {
                                    var result = {};
                                    result.response = [{ order_id : options.order_id }];
                                    result.status = 200;
                                    result.error = null;
                                    res.send(result);
                                }
                              });
                            }
                        });
                      }
                    });
                 }
              }
              else
              {
                  var result = {};
                  result.response = null;
                  result.status = 300;
                  result.error = null;
                  res.send(result);
              }
            });
         });
      });
}

function getOrder(req, res){
     var options = {
            user_id : req.body.user_id,
      };
      backend.getOrder(options, function(orders_result){
        if(orders_result.length > 0)
        {
          var json_result = [];
          var count = 0;
          for(var key in orders_result)
          {
            backend.getProductImage(orders_result[key], function(response){
              count++;
              json_result.push(response);
              if(count == orders_result.length)
              {
                    var result = {};
                    result.response = json_result;
                    result.status = 200;
                    result.error = null;
                    res.send(result);
              }
            });  
          }
        }
        else
        {
          var result = {};
          result.response = [];
          result.status = 200;
          result.error = null;
          res.send(result);
        }
      }); 
}


function getSellerOrder(req, res){ 
    var options = {
           user_id : req.body.user_id,
     };
     backend.getSellerOrder(options, function(orders_result){
       if(orders_result.length > 0)
       {
         var json_result = [];
         var count = 0;
         for(var key in orders_result)
         {
           backend.getProductImage(orders_result[key], function(response){
             count++;
             json_result.push(response);
             if(count == orders_result.length)
             {
                   var result = {};
                   result.response = json_result;
                   result.status = 200;
                   result.error = null;
                   res.send(result);
             }
           });  
         }
       }
       else
       {
         var result = {};
         result.response = [];
         result.status = 200;
         result.error = null;
         res.send(result);
       }
     }); 
}


function getOrderById(req, res){
    let payload =  {
        order_id: req.body.order_id,
        product_id: req.body.product_id
    }
    backend.getOrderById(payload, function (response){
        res.send(response);
    });
}


function postOrder(req, res){
    let payload = req.body;
    backend.postOrder(payload, function (response){
        res.send(response);
    });
}

function updateOrder(req, res){
    let payload = req.body;
    backend.updateOrder(payload, function (response){
        res.send(response);
    });
}

function deleteOrder(req, res){
    let payload = req.body;
    backend.deleteOrder(payload, function (response){
        res.send(response);
    });
}