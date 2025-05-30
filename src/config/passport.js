const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('../models');
const config = require('./config');
const { tokenTypes } = require('./token');

const jwtOptions = {
  secretOrKey: 'a18ZzdHWRx',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await db.user.findByPk(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user.dataValues);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
