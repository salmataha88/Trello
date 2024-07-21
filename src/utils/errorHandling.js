export const asyncHandler = (API)=>{
    return (req , res , next)=>{ 
        API(req , res , next).catch((err)=>{
            res.status(500).json({Message : 'FAIL'});
            console.log(err);
        })
    }
}