const User = require("../model/users.model");
const  bcrypt = require("bcryptjs");
const  generateToken = require("../middleware/generateToken");

// -------------- register -------------------------------

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.log("sing in faild");
    res.status(404).json({ message: "User created faild" });
  }
};

// -------------- Login -------------------------------

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid password" });
    }

    // JWT token 
    const token = await generateToken(user._id)
    // console.log( token);
       
    res.cookie('token', token,{
      httpOnly:true,
      secure:true,
      sameSite:true
    })


    res.status(200).json({ message: "Login ", token, user:{
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage:  user.profileImage,
      bio:  user.bio,
      profession : user.profession
    }});

  } catch (error) {
    console.log("Login in faild", error);
    res.status(404).json({ message: "Login faild" });
  }
};

// 

const logout = (req,res) =>{
  try {
    res.clearCookie('token');
    res.status(200).send({ message: " logout  success  " });
  } catch (error) {
    console.log(" login out faild :", error);
    res.status(404).send({ message: "login out faild " });
  }

}

module.exports = {
  register,
  login,
  logout,
};
