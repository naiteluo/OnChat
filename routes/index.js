
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'OnChat' });
};

/*
 * GET 404 error page.
 */

exports.error = function(req, res){
	console.log("404");
  res.render('404', { title: '404' });
};