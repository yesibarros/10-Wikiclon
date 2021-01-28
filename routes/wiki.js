const express = require('express');
const router = express.Router();
const { Page, User } = require('../models');

//  /wiki
router.get('/', (req, res, next) => {
  Page.findAll()
    .then(pages => res.render('index', { pages })) // { pages: pages}
    .catch(next);
});

router.get('/add', (req, res) => { // this has to be before the /:urlTitle route -->Order: Middleware1--->Middleare2
    return res.render('addpage');
});

router.post('/', (req, res, next) => {
  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email
    }
  })
    .then(data => { // indentation forever
      const user = data[0];
      Page.create({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status,
        tags: req.body.tags
      })
        .then(page => page.setAuthor(user))
        .then(page => res.redirect(page.route));
    })
    .catch(next);
});

router.get('/search', (req, res, next)=>{
  console.log(req.query.tag)
  if(!req.query.tag) return res.render("searchTag")
  Page.findByTag(req.query.tag)
      .then(pages => {
          return res.render('index',{
              pages:pages,
          })
      })
})

router.get('/:urlTitle', (req, res, next) => {
  // Finding the Page
  Page.findOne({
    where: {
        urlTitle: req.params.urlTitle
    }
  })
    // Then -> finding the author of that Page
    .then(page => {
      if(!page) next('No se encontro tu pagina');
      //console.log(page.renderedContent)
      page.getAuthor() //getAuthor is automagic model method created by sequelize using the alias (get+Alias)
        .then(author => { // Nested .then so we can remember `page`
          page.author = author
          return res.render('wikipage', { page });
        })
    }) 
});


/** EDIT **/
router.get('/:urlTitle/edit', (req, res, next) => {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
    .then(page => {
      if(!page) return next('No se encontro tu pagina');
      return res.render('editpage', { page });
    })
    .catch(next);
});

router.post('/:urlTitle/edit', (req, res, next) => {

  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
    .then(page => {
      for (var key in req.body) {
        page[key] = req.body[key];
      }
      return page.save()
    })
    .then(updatedPage=> {
      return res.redirect(updatedPage.route)
    })
    .catch(next);
});
/*********/

/** DELETE **/
router.get('/:urlTitle/delete', (req, res, next) => {
  Page.destroy({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
    .then(() => res.redirect('/wiki'))
    .catch(next);
});
/*********/

router.get('/:urlTitle/similar', (req, res, next) => {

  Page.findOne({
      where: {
          urlTitle: req.params.urlTitle
      }
  })
      .then(function (page) {

          if(!page) next('No se encontro tu pagina');

          return page.findSimilar();

      })
      .then(function (similarPages) {
          return res.render('index', {
              pages: similarPages
          });
      })
      .catch(next);

});

/*
router.get('/search/:tag', (req, res, next) => {
  Page.findByTag(req.params.tag)
      .then(pages=>res.render('index', {pages}))
      .catch(next);
});
*/


module.exports = router;
