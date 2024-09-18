import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: '15d',
    });

    res.cookie('jwt', token, {   
        httpOnly: true, // Cookie cannot be accessed by client-side scripts
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 
        sameSite: "strict", // CSRF protection
        
    });
    
    return token;
}

export default generateTokenAndSetCookie;