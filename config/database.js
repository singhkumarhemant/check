if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://hemant:hemant1234@ds251022.mlab.com:51022/expressadminpanel'}
  } else {
    module.exports = {mongoURI: 'mongodb://localhost/expressAdminPanel'}
  }
