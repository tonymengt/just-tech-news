const router = require("express").Router();
const { User, Post, Vote, Comment } = require("../../models");
const sequelize = require('../../config/connection');

router.get("/", (req, res) => {
  console.log("=================");
  Post.findAll({
    order: [['created_at', 'DESC']],
    attributes: ["id", "post_url", "title", "created_at", [
      sequelize.literal('(SELECT COUNT (*) FROM vote where post.id = vote.post_id)'), 'vote_count'
    ]],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text','post_id', 'user_id', 'created_at'],
        include:{
          model:User,
          attributes:["username"]
        }
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "post_url", "title", "created_at", [
      sequelize.literal('(SELECT COUNT (*) FROM vote Where post.id = vote.post_id)'), 'vote_count'
    ]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text','post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ["username"]
        }
      }
    ]
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "no post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  Post.create(req.body)
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/upvote', (req, res) => {
  Vote.create(req.body, {Vote})
  .then(dbPostData => {res.json(dbPostData)})
  .catch(err=> {
    console.log(err);
    res.status(400).json(err)
  }
)
})

router.put("/:id", (req, res) => {
 Post.update(
    {
      title: req.body.title,
      user_id: req.body.user_id
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "no post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) =>{
    Post.destroy({
        where:{
            id:req.params.id
        }
    }
    )
    .then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({message: 'post id not found'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

module.exports = router;
