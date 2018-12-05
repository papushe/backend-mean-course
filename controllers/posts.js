const Post = require('../models/post');

exports.createPost = async (req, res, next) => {
    try {
        const url = req.protocol + '://' + req.get("host");
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + "/images/" + req.file.filename,
            creator: req.userData.userId
        });
        let result = await post.save();
        res.status(201).json({
            message: 'Post added successfully!',
            post: {
                ...result,
                id: result._id
            }
        })
    } catch (e) {
        res.status(500).json({
            message: `Creating a post failed! ${e}`
        })
    }
};

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery.then(documents => {
        fetchedPosts = documents;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            message: 'Post fetched successfully!',
            posts: fetchedPosts,
            maxPosts: count
        });
    })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed!'
            })
        });
};

exports.getPostById = async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id);
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({
                message: 'Post not found!'
            });
        }
    } catch (e) {
        res.status(500).json({
            message: `Fetching post failed! ${e}`
        })
    }
};

exports.updatePost = async (req, res, next) => {
    try {
        let imagePath = req.body.imagePath;
        if (req.file) {
            const url = req.protocol + '://' + req.get("host");
            imagePath = url + "/images/" + req.file.filename
        }
        const post = new Post({
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath,
            creator: req.userData.userId
        });

        let result = await Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post);
        if (result.n > 0) {
            res.status(200).json({
                message: 'Update successful!'
            });
        } else {
            res.status(401).json({
                message: 'Not authorized!'
            });
        }
    } catch (e) {
        res.status(500).json({
            message: `Couldn't update post ${e}`
        });
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        let result = await Post.deleteOne({_id: req.params.id, creator: req.userData.userId});
        if (result.n > 0) {
            res.status(200).json({
                message: 'Post deleted successfully!'
            });
        } else {
            res.status(401).json({
                message: 'Not authorized!'
            });
        }
    } catch (e) {
        res.status(500).json({
            message: `Deleting post failed! ${e}`
        })
    }
};
