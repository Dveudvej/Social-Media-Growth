const express=require("express"),path=require("path");
const app=express();app.use(express.json());app.use(express.static(path.join(__dirname,"public")));
const orders=[];
app.post("/api/orders",(req,res)=>{
 const {platform,service,link,quantity,amount,utr}=req.body;
 if(!platform||!service||!link||!quantity||!utr||Number(amount)<200)return res.status(400).json({ok:false,message:"Please complete all fields. Minimum order is ₹200."});
 if(orders.some(o=>o.utr===String(utr).trim()))return res.status(409).json({ok:false,message:"This UTR has already been submitted."});
 const order={id:"SMG-"+Date.now().toString(36).toUpperCase(),platform,service,link,quantity:Number(quantity),amount:Number(amount),utr:String(utr).trim(),paymentStatus:"PENDING_VERIFICATION",createdAt:new Date().toISOString()};
 orders.push(order);res.json({ok:true,order});
});
app.get("/api/orders/:id",(req,res)=>{const o=orders.find(x=>x.id===req.params.id);if(!o)return res.status(404).json({ok:false});res.json({ok:true,order:o})});
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(process.env.PORT||3000,()=>console.log("Social Media Growth running"));