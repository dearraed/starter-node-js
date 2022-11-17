export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;

export const db = {
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || ''
};

export const corsUrl = process.env.CORS_URL;

export const tokenInfo = {
  expireIn: process.env.ExpiresIn,
  secret: process.env.SECRET,
  jwtCookieExpireIn: process.env.JWT_COOKIE_EXPIRES_IN
};

export const logDirectory = process.env.LOG_DIR;

export const seeder = {
  adminName: process.env.ADMIN_NAME || 'admin',
  adminLastName: process.env.ADMIN_LAST_NAME || 'adminlastname',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@admin.com',
  adminPass: process.env.ADMIN_PASS || 'admin21234'
}

export const mailing = {
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
      user:process.env.EMAIL_USERNAME,
      pass:process.env.EMAIL_PASSWORD
    }
}


