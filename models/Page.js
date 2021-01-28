const S = require('sequelize');
const db = require('../db');
const marked = require('marked') //https://github.com/markedjs/marked

class Page extends S.Model {}

Page.init({
  title: {
    type: S.STRING,
    allowNull: false,
  },
  urlTitle: {
    type: S.STRING, //255 text limit
    allowNull: false,
  },
  content: {
    type: S.TEXT, //unlimit text
    allowNull: false,
  },
  status: {
    //When you need a predefined list of values which do represent some kind of numeric or textual data, you should use an enum
    //enum are lists of constants. Increase the compile-time.
    type: S.ENUM('open', 'closed')
  },
  date: {
    type: S.DATE,
    defaultValue: S.NOW
  },
  route: {
    type: S.VIRTUAL, //A virtual value that is not stored in the DB
    get() {
        // instance.field = instance.get('field') = instance.getDataValue('field')
        // we can use page.route now and see the complete url..
        // in getters and setters we always use getDataValue and setDataValue for acces directly to db values, avoiding infinite loops
        // http://docs.sequelizejs.com/class/lib/model.js~Model.html#getdatavaluekey-any
        return `/wiki/${this.getDataValue('urlTitle')}`;
    }
  },
  tags:{
    type:S.ARRAY(S.STRING),
    defaultValue:[],
    set: function(tags){
        tags = tags || []
        if(typeof tags === 'string'){
            tags = tags.split(',').map(function(str){
                return str.trim()
            })
        }
        this.setDataValue("tags", tags)
    }
},
  renderedContent: {
      type: S.VIRTUAL,
      get() {
          return marked(this.getDataValue('content'));
      }
  }
}, { sequelize : db, modelName: 'page' });

// HOOKS
// Order : http://docs.sequelizejs.com/manual/hooks.html
// Bulks : http://docs.sequelizejs.com/manual/instances.html#working-in-bulk--creating--updating-and-destroying-multiple-rows-at-once-
Page.beforeValidate((page, options) => {
  if (page.title) {
    page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
    options.fields.push('urlTitle');
  }
});

Page.findByTag = function(tag){
  return Page.findAll({
      where : {
          tags: {
              [S.Op.overlap]: [tag],
          }
      }    

  })
}

Page.prototype.findSimilar = function(){
  console.log(this.tags)

  return Page.findAll({
      where:{
          id: {
              [S.Op.not]: this.id,
          },
          tags: {
              [S.Op.overlap]: this.tags,
          }
      }
  })
}

// Instance Methods Vs Class Methods: https://sequelize-guides.netlify.com/instance-and-class-methods/

module.exports = Page;