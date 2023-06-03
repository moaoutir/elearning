module.exports=(permission)=>{
  return (req,rep,next)=>{
    console.log("kkkk");
    console.log(permission,"llflf",req.userData.role);
    if (permission===req.userData.role) {
      next();
    }
    rep.status(401).json({message : "unauthorized"})
  }
}
