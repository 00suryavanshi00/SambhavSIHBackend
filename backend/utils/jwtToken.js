const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    //options for cookies
    // we're trying to store the jwt token in the cookies
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // 7 days
        ),
        httpOnly: true
    };
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token,
    });

};

module.exports = sendToken;