const md5 = require ("md5");
const db = require ("../Helper/dbHelper.js")

module.exports = function (props){
    return {
// -----------------------login---------------------------------------
        getUserAccount : getUserAccount,
        registration : registration,
        getUserFromCredentials : getUserFromCredentials,
// -----------------------Category---------------------------------------
        getCategory : getCategory,
        getCategoryById: getCategoryById,
        getProductsByCategoryId: getProductsByCategoryId,
        postCategory : postCategory,
        updateCategory: updateCategory,
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
        getAvailQuantity : getAvailQuantity,
        getCartIdOfUser : getCartIdOfUser,
        createCartForCustomer : createCartForCustomer,
        checkSameVendorProduct : checkSameVendorProduct,
        checkItemInCart : checkItemInCart,
        cartUpdate : cartUpdate,
        insertCartItem : insertCartItem,
        removeCartItem : removeCartItem,
        deleteAllCartItems : deleteAllCartItems,
        getCartItems : getCartItems,
        getProductImages : getProductImages,
        shippingAddress : shippingAddress,
        productavailcheck : productavailcheck,

        getOrderNumber : getOrderNumber,
        createOrderRecord : createOrderRecord,
        getCartProducts : getCartProducts,
        addProductsToOrder : addProductsToOrder,
        updateOrderNum : updateOrderNum,

        getOrder : getOrder,
        getSellerOrder : getSellerOrder,
        getProductImage : getProductImage,
        getOrderById : getOrderById,
        postOrder : postOrder,
        updateOrder: updateOrder,
        deleteOrder : deleteOrder

    }
}

// -----------------------login---------------------------------------

function getUserAccount(options, callback)
{
    var stmt = 'select * from p_user where (user_name="'+options.user_name+'" OR '+
               'contact_no="'+options.contact_no+'") && org_id="'+ options.org_id +'"';
    db.query(stmt, function(err, res, fields)
    {
    if (!err)
    {
         options.response = res;
         options.status = 200;
         options.error = null;
         callback(options);
    }
    else
    {
         options.response = null;
         options.status = 500;
         options.error = err;
         callback(options);
    }
   });
}


function registration(options, callback)
{
     var pass = md5(options.password);
     var query_stmt = 'insert into `p_user` (`org_id`,`full_name`,`user_name`,`password`,'+
                      '`user_type`,`contact_no`) values '+
                      '("'+ options.org_id +'","'+ options.full_name +'","'+ options.user_name +'",'+
                      '"'+ pass +'","'+ options.user_type +'","'+ options.contact_no +'")';

     db.query(query_stmt, function(err, res, fields) {
      if (!err)
      {
          callback(res);
      }
      else
      {
          options.response = null;
          options.status = 500;
          options.error = err;
          callback(options);
      }
     });
}


// fetches the customer info to check customer present while login-process
function getUserFromCredentials(options, callback)
{

    var pass = md5(options.password);
  
    var stmt = 'select * from p_user where user_name="'+options.username+'" && password="'+pass+'" && '+
               'org_id="'+ options.org_id +'";';
    db.query(stmt, function(err, res, fields) 
    {
    if (!err)
    {
         options.response = res;
         options.status = 200;
         options.error = null;
         callback(options);
    }
    else
    {
         options.response = null;
         options.status = 500;
         options.error = err;
         callback(options);
    }
   });
}
// -----------------------Category---------------------------------------

function getCategory (payload, callback){
    db.query(`SELECT * FROM p_categories`, (err, result, fields)=>{
        if (result){
            callback(result);
        }else{
            callback(err);
        }
    });
}

function getCategoryById (payload, callback){
    let id = payload.id;
    let sqlStmt = `SELECT * FROM p_categories WHERE id = "${id}"`
    db.query(sqlStmt, (err, result, fields)=>{
        if (result){
            callback(result);
        }else{
            callback(err);
        }
    });
}

function getProductsByCategoryId (payload, callback){
    var options = {};
    let id = payload.id;
    console.log(id)
    let sqlStmt = ` SELECT p.id,p.product_name,p.pet_gender,p.pet_age,p.seller_id,u.full_name as seller_name,p.category_id,p.product_type,p.product_price,p.product_total_quantity,p.product_description,p.image_url,p.image_type,p.in_stock,p.created_by,p.creation_time,p.last_modified_by,p.last_modified_time FROM p_product_inventory AS p INNER JOIN p_user as u ON p.seller_id= u.id WHERE p.category_id = "${id}"`
    db.query(sqlStmt, (err, result, fields)=>{
        if (!err)
        {
            console.log(result)
             options.response = result;
             options.status = 200;
             options.error = null;
             callback(options);
        }
        else
        {
             options.response = null;
             options.status = 500;
             options.error = err;
             callback(options);
        }
    });
}

function postCategory(payload, callback){
    let category_name = payload.category_name;
    let description = payload.description;
    let seller_id = payload.seller_id;
    let sqlStmt = `INSERT INTO p_categories (name, description, seller_id) VALUES ("${category_name}","${description}","${seller_id}")`;
    db.query(sqlStmt, (err, result, fields)=>{
        if(result){
            callback(result);            
        }else{
            callback(err);
        }
    });
}

function updateCategory(payload, callback){
    let id = payload.id;
    let category_name = payload.category_name;
    let description = payload.description;
    let seller_id = payload.seller_id;
    let sqlStmt = `UPDATE p_categories SET name= "${category_name}", description= "${description}", seller_id= "${seller_id}" WHERE id= "${id}"`
    db.query(sqlStmt, (err, result, fields)=>{
        if (result){
            callback(result);
        }else{
            callback(err);
        }
    });
}

function deleteCategory(payload, callback){
    let id = payload.id;
    let sqlStmt = `DELETE FROM p_categories WHERE id= "${id}"`;
    db.query(sqlStmt, (err, result, fields)=>{
        if (result){
            callback(result);
        }else{
            callback(err);
        }
    });
}

// -----------------------pet Products---------------------------------------

function getProducts (payload, callback){
    var options = {};
    db.query('SELECT p.id,p.product_name,p.pet_gender,p.pet_age,p.seller_id,u.full_name as seller_name,p.category_id,p.product_type,p.product_price,p.product_total_quantity,p.product_description,p.image_url,p.image_type,p.in_stock,p.created_by,p.creation_time,p.last_modified_by,p.last_modified_time FROM p_product_inventory AS p INNER JOIN p_user as u ON p.seller_id= u.id', (err, result, fields)=>{
        if (!err)
        {
             options.response = result;
             options.status = 200;
             options.error = null;
             callback(options);
        }
        else
        {
             options.response = null;
             options.status = 500;
             options.error = err;
             callback(options);
        }
    });
}



function getProductById (payload, callback){
    var options = {};
    let id = payload.id;
    let sqlStmt =`SELECT p.id,p.product_name,p.pet_gender,p.pet_age,p.seller_id,u.full_name as seller_name,p.category_id,p.product_type,p.product_price,p.product_total_quantity,p.product_description,p.image_url,p.image_type,p.in_stock,p.created_by,p.creation_time,p.last_modified_by,p.last_modified_time FROM p_product_inventory AS p INNER JOIN p_user as u ON p.seller_id= u.id WHERE p.id = "${id}"`
    db.query(sqlStmt, (err, result, fields)=>{
        if (!err)
        {
             options.response = result;
             options.status = 200;
             options.error = null;
             callback(options);
        }
        else
        {
             options.response = null;
             options.status = 500;
             options.error = err;
             callback(options);
        }


    });
}


function getProductsBySellerId (payload, callback){
    var options = {};
    let id = payload.id;
    let sqlStmt =`SELECT p.id,p.product_name,p.pet_gender,p.pet_age,p.seller_id,u.full_name as seller_name,p.category_id,p.product_type,p.product_price,p.product_total_quantity,p.product_description,p.image_url,p.image_type,p.in_stock,p.created_by,p.creation_time,p.last_modified_by,p.last_modified_time FROM p_product_inventory AS p INNER JOIN p_user as u ON p.seller_id= u.id WHERE p.seller_id = "${id}"`
    db.query(sqlStmt, (err, result, fields)=>{
        if (!err)
        {
             options.response = result;
             options.status = 200;
             options.error = null;
             callback(options);
        }
        else
        {
             options.response = null;
             options.status = 500;
             options.error = err;
             callback(options);
        }


    });
}


function postProduct(payload, callback){
    var options = {};
    let seller_id = payload.seller_id;
    let category_id = payload.category_id;
    let image_url = payload.image_url != undefined ? payload.image_url : null;
    let image_type = payload.image_type != undefined ? payload.image_type : null;
    let product_name = payload.product_name;
    let pet_gender = payload.pet_gender != undefined ? payload.pet_gender : null;
    let pet_age = payload.pet_age != undefined ? payload.pet_age : null;
    let product_type = payload.product_type;
    let product_description = payload.product_description;
    let product_total_quantity = payload.product_total_quantity;
    let product_price = payload.product_price;
    let in_stock = payload.in_stock;
    
    let sqlStmt = `INSERT INTO p_product_inventory (seller_id,category_id, image_url, image_type, product_name, pet_gender, pet_age, product_type, product_description, product_total_quantity, product_price, in_stock) VALUES ("${seller_id}","${category_id}","${image_url}","${image_type}","${product_name}","${pet_gender}","${pet_age}","${product_type}","${product_description}","${product_total_quantity}","${product_price}","${in_stock}")`;
   
    db.query(sqlStmt, (err, result, fields)=>{
        if(result){    
        let sql = `INSERT INTO p_product_images (product_id, product_image) VALUES ("${result.insertId}","${image_url}")`;
            db.query(sql, function(error, res)
            {
                if(!error){
                    options.response = res;
                    options.status = 200;
                    options.error = null;
                    callback(options);
                } else {
                    options.response = null;
                    options.status = 500;
                    options.error = error;
                    callback(options);
                }
            });
           
       }
       else
       {
            options.response = null;
            options.status = 500;
            options.error = err;
            callback(options);
        }
    });
}

function updateProduct(payload, callback){
    var options = {};
    
    let id = payload.id;
    let seller_id = payload.seller_id;
    let category_id = payload.category_id;
    // let image_url = payload.image_url != undefined ? payload.image_url : null;
    let image_type = payload.image_type != undefined ? payload.image_type : null;
    let product_name = payload.product_name;
    let pet_gender = payload.pet_gender != undefined ? payload.pet_gender : null;
    let pet_age = payload.pet_age != undefined ? payload.pet_age : null;
    let product_type = payload.product_type;
    let product_description = payload.product_description;
    let product_total_quantity = payload.product_total_quantity;
    let product_price = payload.product_price;
    let in_stock = payload.in_stock;
    let sqlStmt = `UPDATE p_product_inventory SET seller_id= "${seller_id}",category_id= "${category_id}", image_type= "${image_type}", product_name= "${product_name}", pet_gender= "${pet_gender}",pet_age= "${pet_age}",product_type= "${product_type}",product_description= "${product_description}",product_total_quantity= "${product_total_quantity}",product_price= "${product_price}",in_stock= "${in_stock}" WHERE id= "${id}"`
    db.query(sqlStmt, (err, result, fields)=>{
        if (result){
            options.response = result;
            options.status = 200;
            options.error = null;
            callback(options);
        }else{
            options.response = null;
            options.status = 500;
            options.error = err;
            callback(options);
        }
    });
}


function updateProductStatus(options, callback)
{
console.log(options)
    let sqlStmt = 'UPDATE `p_orders_details` SET status="'+options.product_status+'" WHERE order_id="'+ options.order_id +'" && product_id="'+ options.product_id +'";';
  
    db.query(sqlStmt, function(err, res, fields) {
    if (!err)
    {
          var options = {};
          options.response = res;
          options.status = 200;
          options.error = null;
          callback(options); 
    }
    else
    { 
          options.response = null;
          options.status = 500;
          options.error = err;
          callback(options);
    }
    });  
}

function deleteProduct(payload, callback){
    let id = payload.id;
    let sqlStmt = `DELETE FROM  p_product_inventory WHERE id= "${id}"`;
    db.query(sqlStmt, (err, result, fields)=>{
    if (!err)
    {
          var options = {};
          options.response = result;
          options.status = 200;
          options.error = null;
          callback(options); 
    }
    else
    { 
          options.response = null;
          options.status = 500;
          options.error = err;
          callback(options);
    }
    });
}

// -----------------------pet order---------------------------------------

function getAvailQuantity(options, callback)
{
   let sqlStmt = 'select product_total_quantity from p_product_inventory where id = "'+ options.product_id +'"';
   db.query(sqlStmt, function(err, res, fields){
      if(!err)
      {
        callback(res[0].product_total_quantity);
      }
      else
      {
        var options = {};
        options.response = null;
        options.status = 500;
        options.error = err;
        callback(options);
      }  
   });
}

function getCartIdOfUser(options, callback)
{
    let sqlStmt = 'select id from p_cart where customer_id="'+options.user_id+'";';
    db.query(sqlStmt, function(err, res, fields) {
    if (!err)
    {
        callback(res);
    }
    else
    { 
         options.response = null;
         options.status = 500;
         options.error = err;
         callback(options);
    }
    }); 
}

function createCartForCustomer(options, callback)
{
   // traditional sql ------------------------------------!!

   let sqlStmt = 'insert into `p_cart` (`customer_id`) values ("'+ options.user_id +'");';

    db.query(sqlStmt, function(err, res, fields) {
      if (!err)
      {
          cart_id = res.insertId;
          callback(cart_id);
      }
      else
      {
          options.response = null;
          options.status = 500;
          options.error = err;
          callback(options);
      } 
    });   
}

function checkSameVendorProduct(options, callback)
{

   let sqlStmt = 'select * from `p_cart_item` where cart_id="'+options.cart_id+'" &&  '+
                    'seller_id != "'+ options.seller_id +'";';
  
    db.query(sqlStmt, function(err, res, fields) {
    if (!err)
    {
          callback(res);
    }
    else
    {
          options.response = null;
          options.status = 500;
          options.error = err;
          callback(options);
    }
    });  
}

function checkItemInCart(options, callback)
{

   let sqlStmt = 'select * from `p_cart_item` where cart_id="'+options.cart_id+'" &&  '+
                    'product_id="'+ options.product_id +'";';

    db.query(sqlStmt, function(err, res, fields) {
    if (!err)
    {
          callback(res);
    }
    else
    {
          options.response = null;
          options.status = 500;
          options.error = err;
          callback(options);
    }
    });  
}

function cartUpdate(options, callback)
{

    let sqlStmt = 'UPDATE `p_cart_item` SET quantity='+options.qty+' WHERE '+
                     'p_cart_item.cart_id='+ options.cart_id +' && p_cart_item.product_id="'+ options.product_id +'";';
  
    db.query(sqlStmt, function(err, res, fields) {
    if (!err)
    {
          var options = {};
          options.response = [{ "avail_qty" : options.avail_qty}];
          options.status = 200;
          options.error = null;
          callback(options); 
    }
    else
    {
          options.response = null;
          options.status = 500;
          options.error = err;
          callback(options);
    }
    });  
}

function insertCartItem(options, callback)
{
    let sqlStmt = 'insert into `p_cart_item` (`cart_id`, `product_id`,`seller_id`,`quantity`) values '+
                      '("'+ options.cart_id +'","'+ options.product_id +'","'+ options.seller_id +'",'+
                      '"'+ options.quantity +'");';

     db.query(sqlStmt, function(err, res, fields) {
      if (!err)
      {
          var options = {};
          options.response = [{ "avail_qty" : options.avail_qty }];
          options.status = 200;
          options.error = null;
          callback(options);
      }
      else
      {
          options.response = null;
          options.status = 500;
          options.error = err;
          callback(options);
      }
     });
}


function removeCartItem(options, callback)
{
     let sqlStmt = 'delete from p_cart_item where cart_id='+options.cart_id+' && product_id="'+options.product_id+'";'
    
     db.query(sqlStmt, function(err, res, fields) {
      if (!err)
      {
          var options = {};
          options.response = null;
          options.status = 200;
          options.error = null;
          callback(options);
      }
      else
      {
          options.response = null;
          options.status = 500;
          options.error = err;
          callback(options);
      }
     });
    }


    // delete all the cart items
function deleteAllCartItems(option, callback)
{
   var query_stmt = 'delete from p_cart_item where cart_id="'+option.cart_id+'";'
   db.query(query_stmt, function(err, res, fields) {
    if (!err)
    {
          var options = {};
          options.affectedRows = res.affectedRows;
          options.response = res;
          options.status = 200;
          options.error = null;
          callback(options);
    }
    else
    {
          options.response = null;
          options.status = 500;
          options.error = err;
          callback(options);
    }
   });
}

function getCartItems(options, callback)
{
    let sqlStmt = 'select p_cart_item.cart_id,p_cart_item.product_id,p_cart_item.seller_id,p_user.full_name as seller_name,p_user.profile_img as seller_img,p_product_inventory.product_name,p_product_inventory.category_id,p_cart_item.quantity,p_product_inventory.product_price,p_product_inventory.product_total_quantity,p_product_inventory.product_description from `p_cart_item` inner join p_cart on p_cart_item.cart_id=p_cart.id inner join p_product_inventory on p_product_inventory.id=p_cart_item.product_id inner join p_user on p_user.id=p_cart_item.seller_id where p_cart.customer_id = "'+options.user_id+'";'

    db.query(sqlStmt, function(err, res, fields) {
     if (!err)
     {
         callback(res);
     }
     else
     {
         options.response = null;
         options.status = 500;
         options.error = err;
         callback(options);
     }
    });
}

function getProductImages(options, callback)
{

    let sqlStmt = 'select product_image from p_product_images where product_id="'+ options.product_id +'";';

    db.query(sqlStmt, function(err, res, fields) {
    if (!err)
    {
        var images = [];
        if(res.length > 0)
        {
          for(var i=0;i<res.length;i++)
          {
            images.push(res[i].product_image);
          }
        }
        options.product_images = images;
        callback(options);
    }
    else
    {
         options.response = null;
         options.status = 500;
         options.error = err;
         callback(options);
    }
  });   
}

function productavailcheck(options, callback)
{

   let sqlStmt = 'select p_cart_item.product_id,quantity,product_total_quantity from p_cart_item '+
                    'inner join p_product_inventory on p_product_inventory.id=p_cart_item.product_id '+
                    'where cart_id='+ options.cart_id +';';
   db.query(sqlStmt, function(err, res, fields){
     if(!err)
     {
         callback(res);
     }
     else
     {
         var options = {};
         options.response = null;
         options.status = 500;
         options.error = err;
         callback(options);
     }
   }); 
}

function getOrderNumber(option, callback)
{
   // traditional sql ------------------------------------!!

   var query_stmt = 'select order_num from p_last_order_no';
   db.query(query_stmt, function(err, res, fields){
       if(!err)
       {
          option.order_num = res[0].order_num + 1;
          callback(option);
       }
       else
       {
          var options = {};
          options.response =  null;
          options.error    =  err;
          options.status   =  500;
          callback(options);
       }
   });
}

function createOrderRecord(option, callback)
{
     var order_num_format = 'p'+option.year+option.month+option.day+option.order_num;

     var query_stmt = 'insert into `p_orders` (`order_no`,`seller_id`,`customer_id`,`price`,`shipping_price`,`tax_amount`,`grand_price`) values ("'+ order_num_format +'","'+ option.seller_id +'","'+ option.user_id +'","'+ option.total_price +'","'+ option.shipping_price +'","'+option.tax_amount+'","'+ option.grand_price +'")';
     db.query(query_stmt, function(err, res, fields) {
        if (!err)
        {
          option.order_id = res.insertId;
          callback(option);
        }
        else
        {
          var options = {};
          options.response = null;
          options.status = 500;
          options.error = err;
          callback(options);
        }
       });
}


function getCartProducts(option, callback)
{
   var query_stmt = 'select product_id,quantity from p_cart_item where cart_id='+ option.cart_id +';';
   db.query(query_stmt, function(err, res, fields){
     if(!err)
     {
        callback(res);
     }
     else
     {
        var options = {};
        options.response = null;
        options.error    = err;
        options.status   = 500;
        callback(options);
     }
   });
}


function addProductsToOrder(option, cart_record , callback)
{
   var query_stmt = 'select product_price,product_total_quantity from p_product_inventory where id='+ cart_record.product_id +'';
   db.query(query_stmt, function(err, query_res, fields){
     if(!err)
     {
         if(query_res.length > 0)
        {
            var query_stmt = 'insert into `p_orders_details` (`order_id`,`product_id`,`quantity`,`price`) '+
                             'values ("'+ option.order_id +'","'+ cart_record.product_id +'",'+
                             '"'+ cart_record.quantity +'","'+ query_res[0].product_price +'")';
                            
            db.query(query_stmt, function(err, res, fields) {
            if (!err)
            {
                var remain_qty = query_res[0].product_total_quantity - cart_record.quantity;

                var query_stmt = 'update p_product_inventory set product_total_quantity = '+ remain_qty +' where '+
                                 'id = '+ cart_record.product_id +'';

                db.query(query_stmt, function(err, update_res, fields){
                  if(!err)
                  {
                      callback(res);  
                  }
                  else
                  {
                      var options = {};
                      options.response = null;
                      options.status = 500;
                      options.error = err;
                      callback(options);  
                  }
                });   
            }
            else
            {
                options.response = null;
                options.status = 500;
                options.error = err;
                callback(options);
                             
            }
           });
        }
     }
     else
     {
        var options = {};
        options.response = null;
        options.error    = err;
        options.status   = 500;
        callback(options);
     }
   });
}

function updateOrderNum(options, callback)
{
   var query_stmt = 'UPDATE `p_last_order_no` SET order_num = "'+ options.order_num +'";';
   db.query(query_stmt, function(err, res, fields) {
    if (!err)
    {
         callback(res);
    }
    else
    {
        options.response = null;
        options.status = 500;
        options.error = err;
        callback(options);
    }  
   }); 
}

function shippingAddress(payload, callback){
    var options = {};

    let order_id = payload.order_id;
    let full_name = payload.full_name;
    let email = payload.email;
    let address = payload.address;
    let city = payload.city; 
    let state = payload.state;
    let zip = payload.zip;
    let area = payload.area;
    let landmark = payload.landmark;
    let contact_no = payload.contact_no;  
  

    let sqlStmt =`insert into p_orders_address (order_id,full_name,email,address,area,city,state,zip,landmark,contact_no) values ("${order_id}","${full_name}","${email}","${address}","${area}","${city}","${state}","${zip}","${landmark}","${contact_no}")`;
    db.query(sqlStmt,(err, result, fields)=>{
        if(result){
            options.response = result;
            options.status = 200;
            options.error = null;
            callback(options);
        }else{
            options.response = null;
            options.status = 500;
            options.error = err;
            callback(options);
        }
    });
}

function getOrder (payload, callback){
    console.log(payload)

   var sqlStmt = 'select p_orders.id as order_id,p_orders_details.product_id,p_orders.order_no,p_orders_details.price,p_product_inventory.product_name,DATE(p_orders.last_modified_time) as date,TIME(p_orders.last_modified_time) as time,p_user.full_name as seller_name from p_orders inner join p_orders_details on p_orders.id = p_orders_details.order_id inner join p_user on p_user.id = p_orders.seller_id inner join p_product_inventory on p_product_inventory.id = p_orders_details.product_id where p_orders.customer_id='+payload.user_id+' order by p_orders_details.last_modified_time DESC;'; 
    
    db.query(sqlStmt, function(err, res, fields)
    {
        if (!err)
            {
               
            callback(res);
            }
        else
        {
            console.log(err)
            var options = {};
            options.response = null;
            options.status = 500;
            options.error = err;
            callback(options);
        }
    });
}



function getSellerOrder (payload, callback){
    console.log(payload)

   var sqlStmt = 'select p_orders.id as order_id,p_orders_details.product_id,p_orders.order_no,p_orders_details.price,p_orders_details.quantity,p_product_inventory.product_name,p_orders_details.status,p_orders.last_modified_time as date,TIME(p_orders.last_modified_time) as time,p_user.full_name as seller_name, p_orders_address.full_name, p_orders_address.address,p_orders_address.contact_no,p_orders_address.area,p_orders_address.landmark,p_orders_address.city,p_orders_address.state,p_orders_address.zip from p_orders inner join p_orders_details on p_orders.id = p_orders_details.order_id inner join p_user on p_user.id = p_orders.seller_id inner join p_product_inventory on p_product_inventory.id = p_orders_details.product_id inner join p_orders_address on p_orders_address.order_id = p_orders.id where p_orders.seller_id='+payload.user_id+' order by p_orders_details.last_modified_time DESC;'; 

    db.query(sqlStmt, function(err, res, fields)
    {
        if (!err)
            {
               
            callback(res);
            }
        else
        {
            console.log(err)
            var options = {};
            options.response = null;
            options.status = 500;
            options.error = err;
            callback(options);
        }
    });
}

function getProductImage(option, callback)
{

   var query_stmt = 'select product_image from p_product_images where product_id = "'+ option.product_id +'" '+
                    'order by creation_time ASC limit 1';
   db.query(query_stmt, function(err, res, fields){
     if(!err)
     {
         console.log("image : ", option)
         option.product_image = res[0].product_image;
         callback(option);
     }
     else
     {
         console.log("err : ",err)
         var options = {};
         options.response = null;
         options.status = 500;
         options.error = err;
         callback(options);
     }
   });   
}

function getOrderById (payload, callback){
    var options = {};
    let sqlStmt = 'SELECT * FROM p_orders_details where order_id = "'+payload.order_id+'" and product_id = "'+payload.product_id+'"'
    db.query(sqlStmt, (err, result, fields)=>{
        if (result)
        {
            options.response = result;
            options.status = 200;
            options.error = null;
            callback(options);
       }
       else
       {
            options.response = null;
            options.status = 500;
            options.error = err;
            callback(options);
       }
    });
}

function postOrder(payload, callback){
    let user_id = payload.user_id;
    let pet_product_id = payload.pet_product_id;
    let creation_time = payload.creation_time;
    let updated_at = payload.updated_at;    
    let sqlStmt = `INSERT INTO orders (user_id, pet_product_id, creation_time, updated_at) VALUES ("${user_id}","${pet_product_id}","${creation_time}","${updated_at}")`;
    db.query(sqlStmt, (err, result, fields)=>{
        if(result){
            callback(result);            
        }else{
            callback(err);
        }
    });
}

function updateOrder(payload, callback){
    let id = payload.id;
    let user_id = payload.user_id;
    let pet_product_id = payload.pet_product_id;
    let creation_time = payload.creation_time;
    let updated_at = payload.updated_at; 
    let sqlStmt = `UPDATE orders SET user_id= "${user_id}", pet_product_id= "${pet_product_id}", creation_time= "${creation_time}", updated_at= "${updated_at}" WHERE id= "${id}"`
    db.query(sqlStmt, (err, result, fields)=>{
        if (result){
            callback(result);
        }else{
            callback(err);
        }
    });
}

function deleteOrder(payload, callback){
    let id = payload.id;
    let sqlStmt = `DELETE FROM orders WHERE id = "${id}"`;
    db.query(sqlStmt, (err, result, fields)=>{
        if (result){
            callback(result);
        }else{
            callback(err);
        }
    });
}