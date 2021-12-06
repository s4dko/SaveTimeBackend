require('dotenv').config();
const jwt = require('jsonwebtoken');
// const { URL } = require('url');
const queryString = require('query-string');
const axios = require('axios');

const usersModel = require('../repository/users');
const { HttpCode } = require('../helpers/constants');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BASE_URL = process.env.BASE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const imageToBase64 = require('image-to-base64');

const signup = async (req, res, next) => {
  try {
    const user = await usersModel.findByEmail(req.body.email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email is in use',
      });
    }
    const newUser = await usersModel.create(req.body);
    // console.log(`here should be user ${newUser}`);
    const { _id: id, name, email } = newUser;
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          id,
          name,
          email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const stringifiedParams = queryString.stringify({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${BASE_URL}/api/users/google-redirect`,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });
    return res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
    );
  } catch (error) {
    next(error);
  }
};

let existingUser = '';

const googleRedirect = async (req, res, next) => {
  try {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);

    const code = urlParams.code;
    const tokenData = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${BASE_URL}/api/users/google-redirect`,
        grant_type: 'authorization_code',
        code: code,
      },
    });

    const userData = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${tokenData.data.access_token}`,
      },
    });

    const userEmail = userData.data.email;
    const avatar = userData.data.picture;


    existingUser = await usersModel.findByEmail(userEmail);
    if (!existingUser) {
      const avatarBase64 = await imageToBase64(avatar);
      existingUser = await usersModel.create({ email: userEmail, avatar: avatarBase64 });
    }

    const token = jwt.sign({ _id: existingUser.id }, JWT_SECRET_KEY);
    await usersModel.updateToken(existingUser.id, token);
    return res.redirect(`${FRONTEND_URL}/google-user`);
  } catch (error) {
    next(error);
  }
};

const findGoogleUser = async (req, res, next) => {
  const user = await usersModel.findByEmail(existingUser.email);

  const { _id: id, email, token, avatar, trelloToken, trelloKey, trelloBoardId } = user;
  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: {
      token,
      user: {
        id,
        email,
        avatar,
        trelloToken,
        trelloKey,
        trelloBoardId
      },
    },
  });
};

const findUserByEmail = async (req, res, next) => {
  try {
    const user = await usersModel.findByEmail(req.body.email);
    const { _id: id, name, email } = user;
    if (user) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          user: {
            id,
            name,
            email,
          },
        },
      });
    }
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email is not found',
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await usersModel.findByEmail(email);
    const { _id: id, name } = user;
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      });
    }
    const payload = { _id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY);
    await usersModel.updateToken(user.id, token);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
        user: {
          id,
          name,
          email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id: id, name, email, avatar, trelloToken, trelloKey, trelloBoardId } = req.user;
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        user: {
          id,
          name,
          email,
          avatar,
          trelloToken,
          trelloKey,
          trelloBoardId
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await usersModel.updateToken(req.user.id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

const setTrelloSettings = async (req, res, next) => {
  try {
    const user = await usersModel.updateTrelloSettings(req.user.id, req.body.trelloToken, req.body.trelloKey, req.body.trelloBoardId);
    if (user) {
      const { _id: id, name, email, avatar, trelloToken, trelloKey, trelloBoardId } = req.user;
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          user: {
            id,
            name,
            email,
            avatar,
            trelloToken,
            trelloKey,
            trelloBoardId
          },
        },
      });
    }
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'User id is not found',
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  signup,
  googleAuth,
  googleRedirect,
  login,
  logout,
  findUserByEmail,
  findGoogleUser,
  getCurrentUser,
  setTrelloSettings
};
