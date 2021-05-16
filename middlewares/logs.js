let log = (req,res,next)=>{
    console.log(req.method);
    console.log(req.url);
    next()
}

function test (req, res, next){
    console.log("test");
    next();
}


module.exports = {log, test}