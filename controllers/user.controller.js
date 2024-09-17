const User = require("../model/users.model");

const userDelete = async (req,res) =>{
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id)

        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({message:"User deleted successfully" , user})
    } catch (error) {
        console.log(" Deleted user faild", error);
        res.status(404).json({ message: "Deleted user faild" });
    }
}

const allUser = async(req,res) =>{
    try {
        const user = await User.find({}, 'id email role').sort({createdAt : -1})
        res.status(200).json({message:"All user get  successfully" , user})

    } catch (error) {
        console.log(" get all user faild", error);
        res.status(404).json({ message: "get all user faild" });
    }
}

const updateRole = async(req,res) =>{
    try {
        const {id} = req.params;
        const {role} = req.body;

        const user = await User.findByIdAndUpdate(id,{role}, {new:true})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({message:"User role updated successfully" , user})
    } catch (error) {
        console.log("  user role update  faild", error);
        res.status(404).json({ message: "  user role update  faild" });
    }
}


const userProfileUpdate= async(req,res) =>{
    try {
        const {userId,username,profileImage,bio,profession} = req.body;

        if(!userId){
            return res.status(404).json({message:"User id is required"})
        }

        const user = await User.findById(userId);
        
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        // update profile 
        if(username !== undefined )  user.username = username;
        if(profileImage !== undefined) user.profileImage = profileImage;
        if(bio !== undefined) user.bio = bio;
        if(profession !== undefined) user.profession = profession;

        await  user.save();

        res.status(200).json({message:"User  updated update successfully" , user:{
            id:user._id,
            username:user.username,
            profileImage:user.profileImage,
            bio:user.bio,
            profession:user.profession

        }})

        
    } catch (error) {
        console.log("  user Profile  update  faild", error);
        res.status(404).json({ message: "  user Profile  update  faild" });
    }
}


module.exports = {
    userDelete,
    allUser,
    updateRole,
    userProfileUpdate,
}