import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
    // try {
    //     const posts = await PostModel.find().populate('user').exec()
    //     res.json(posts)
    // } catch (err) {
    //     console.log(err)
    //     res.status(500).json({
    //         message: 'Не удалось получить статьи'
    //     })
    // }

    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
  

        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({ message: 'Invalid pagination parameters.' });
        }
  
        const posts = await PostModel.find()
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);
        
        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()
        const tags =  posts.map(obj => obj.tags).flat().slice(0, 5)
        res.json(tags)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedPost = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewCount: 1 } },
            { new: true } 
        );

        if (!updatedPost) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }

        res.json(updatedPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью'
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const deletedPost = await PostModel.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }

        res.json({
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью'
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()
        res.json(post)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

export const update = async (req, res) => {
    try{
        const postId = req.params.id

        await PostModel.updateOne({
            _id: postId,
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        res.json({
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}