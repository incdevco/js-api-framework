var blog = require('./controllers/blog');
var post = require('./controllers/post');

module.exports = function blogModule(application) {

	application.route('/blogs')
		.get(blog.fetchAll())
		.post(blog.add());

	application.route('/blogs/:id')
		.delete(blog.delete())
		.get(blog.fetchOne())
		.put(blog.edit());

	application.route('/blogs/:blog_id/posts')
		.get(blog.fetchAll())
		.post(blog.add());

	application.route('/blogs/:blog_id/posts/:id')
		.delete(blog.delete())
		.get(blog.fetchOne())
		.put(blog.edit());

};
