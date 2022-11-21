module.exports.environment = process.env.NODE_ENV;
module.exports.baseUrl = process.env.BASE_URL;
module.exports.port = process.env.PORT;

module.exports.db = {
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || ''
};

module.exports.corsUrl = process.env.CORS_URL;

module.exports.tokenInfo = {
  expireIn: process.env.EXPIRE_IN,
  secret: process.env.SECRET,
  jwtCookieExpireIn: process.env.JWT_COOKIE_EXPIRES_IN
};

module.exports.logDirectory = process.env.LOG_DIR;

module.exports.seeder = {
  adminName: process.env.ADMIN_NAME || 'admin',
  adminLastName: process.env.ADMIN_LAST_NAME || 'adminlastname',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@gmail.com',
  adminPass: process.env.ADMIN_PASS || 'admin1234'
}

module.exports.mailing = {
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    user:process.env.EMAIL_USERNAME,
    pass:process.env.EMAIL_PASSWORD
    /*auth:{
      user:process.env.EMAIL_USERNAME,
      pass:process.env.EMAIL_PASSWORD
    }*/
}


