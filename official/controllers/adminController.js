
module.exports = {
    getIndex: function (req, res, next){
        if (req.isAuthenticated())
        {
            if (req.user.role == "admin"){
                res.render("pages/adminIndex");
            }
            else
                res.send({message: "Bạn không có quyền truy cập vào trang này!"});
        }
        else
            res.send({message: "Bạn không có quyền truy cập vào trang này!"});
    }
    
}