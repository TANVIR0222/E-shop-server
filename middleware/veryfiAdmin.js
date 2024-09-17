const veryfyAdmin = (req,res,next) =>{
    if(req.role !== 'admin'){
        res.status(404).send({ succss : false , message: "You ar not authorized to prefrom this actions" });
    }

    next();
}

module.exports = veryfyAdmin;
