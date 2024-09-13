import User from "../models/userModel.js";

const signupUser = async (req, res) => {
    try {
        const {name, email, username, password} = req.body;
        const user = await User.findOne({$or: [{email}, {username}]});

        if (user) {
            return res.status(400).json({message: "User already exists"}); 
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in signupUser: ", err.message);
    }
}

export { signupUser };