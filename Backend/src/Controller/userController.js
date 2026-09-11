const usermodel = require("../model/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sessionmodel = require("../model/session.model");

async function Register(req, res) {
  try {
    const { username, email, password, role = "user" } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const isUserExists = await usermodel.findOne({ email });

    if (isUserExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashpassword = await bcryptjs.hash(password, 10);

    const user = await usermodel.create({
      username,
      email,
      password: hashpassword,
      role,
    });

    const accesstoken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshtoken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.REFRESH_JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

 const session=   await sessionmodel.create({
      userId: user._id,
      refreshtoken: refreshtoken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Register Successfully",
      accesstoken,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter your email and password",
      });
    }

    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const checkPassword = await bcryptjs.compare(
      password,
      user.password
    );

    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Password Incorrect",
      });
    }

    const accesstoken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshtoken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.REFRESH_JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await sessionmodel.create({
      userId: user._id,
      refreshtoken: refreshtoken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      accesstoken,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function refreshtoken(req, res) {
  try {
    const token = req.cookies.refreshtoken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.REFRESH_JWT_SECRET
    );

    const session = await sessionmodel.findOne({
      refreshToken: token,
      userId: decoded.userId,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session invalid",
      });
    }

    if (session.expiresAt < new Date()) {
      await sessionmodel.findByIdAndDelete(session._id);

      return res.status(401).json({
        success: false,
        message: "Session expired, please login again",
      });
    }

    const accesstoken = jwt.sign(
      {
        userId: decoded.userId,
        role: decoded.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
      accesstoken,
    });

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired, please login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


module.exports = {
  Register,
  login,
  refreshtoken
};
