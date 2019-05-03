if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI:
      'mongodb://expressadminpanel:Agile1122@ds149596.mlab.com:49596/expressadminpanel'
  };
} else {
  module.exports = { mongoURI: 'mongodb://localhost/expressAdminPanel' };
}
