const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    
    //const idx = node.fileAbsolutePath.indexOf("/pages")+"/pages".length;
    const idx = node.fileAbsolutePath.indexOf("/pages")+"/pages/".length;
    const relevantPath = node.fileAbsolutePath.substring(idx);
    const fileParts = relevantPath.split("/");
    const isIndex = fileParts[fileParts.length-1]==="index.md";
    const fileName = fileParts[fileParts.length-1];
    
    //const folderName = fileParts[fileParts.length-2];
    const fileNameStarts = relevantPath.lastIndexOf("/");
    const folderName = relevantPath.substring(0,fileNameStarts)//+1); 
    
  
    const partsFromFullPath = node.fileAbsolutePath.split("/");
    //const parentFolder = fileParts.length >3 ? fileParts[fileParts.length-3] : null ;
    const folderIndex = folderName.lastIndexOf("/");
    const parentFolder = folderName.substring(0,folderIndex);
    const depth = fileParts.length-1;

    //console.log("FOLDER",folderName,`(${fileParts[fileParts.length-1]})`,`(${relevantPath})`)
   // console.log("Parent",parentFolder,`Depth: ${depth}`)
    
    
    const parts = slug.split("/");
    //Always include the slug
    createNodeField({
      node,
      name: `slug`,
      value: slug
    });
     /*
     Rules:
     For plain md-files
     if frontMatter has a date this is used as shortTitle otherwise it must include a shortTitle 
     if shortTitle is set from a date, the node will get a shortTitleIsDate=date;
     For index.md files
     if frontMatter has a shortTitle it will be used as short title, if not the folder name will be used
     */
    
    if(!isIndex && !( node.frontmatter.date || node.frontmatter.shortTitle)){
      //throw new Error(`${node.fileAbsolutePath} must include a date and/or a shortTitle in its frontmatter`)
    }

    const title = node.frontmatter.title ? node.frontmatter.title : `${fileName} (no title provide in md)`
      
    let shortTittle;
    if(isIndex){
       shortTitle = node.frontmatter.shortTitle ? node.frontmatter.shortTitle : folderName
    } else{
      shortTitle = node.frontmatter.date ? node.frontmatter.date : node.frontmatter.shortTitle;
    }
    if(!shortTitle){
      //Remove Extension. The API will think it's a File if it looks like a file ???????
      shortTitle = path.basename(fileName,path.extname(fileName));
    }
    if(shortTitle){
      createNodeField({
        node,
        name: `shortTitle`,
        value: shortTitle
      });
    }

    if (node.frontmatter.isSP) {
      createNodeField({
        node,
        name: `isSP`,
        value: true
      });
    }
    
    createNodeField({node, name: "title",value: title })
    createNodeField({node, name: "fileName",value: fileName })
    createNodeField({node, name: "inFolder",value: folderName })
    createNodeField({node, name: "isIndex",value: isIndex});
    createNodeField({node, name: "depth",value: depth});
    createNodeField({node, name: "parentFolder",value: parentFolder});

    if (parts.length > 4 && node.fileAbsolutePath.includes("/index.md")) {
      throw new Error("Periods can only have sub-periods one level down")
    }
    if (node.frontmatter.headertext) {
      createNodeField({
        node,
        name: `isSinglePageDocument`,
        value: true
      });
    }
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
                isSinglePageDocument                
                shortTitle
                isIndex
                isSP
              }
            }
          }
        }
      }
    `).then(result => {
      console.log("RESULT",result)
      console.log("DATA",result.data)
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        let template = `./src/templates/blog-post.js`; //fallback        
        if (node.fields.isIndex && !node.fields.isSinglePageDocument){
            //template = `./src/templates/period-description-page.js`
            createPage({
              path: node.fields.slug,
              component: path.resolve(`./src/templates/period-description-page.js`),
              context: {// Data passed to context is available in page queries as GraphQL variables.
                slug: node.fields.slug,   
                shortTitle: node.fields.shortTitle,
              }
            });
        } 
        else if (node.fields.isSP){
          //template = `./src/templates/period-description-page.js`
          createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/templates/studypoint-friday-page.js`),
            context: {// Data passed to context is available in page queries as GraphQL variables.
              slug: node.fields.slug,   
              shortTitle: node.fields.shortTitle,
            }
          });
      } 
        else if (node.fields.isSinglePageDocument) {         
          createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/templates/single-page.js`),
            context: {
              // Data passed to context is available in page queries as GraphQL variables.
              slug: node.fields.slug,
              isSinglePageDocument:node.fields.isSinglePageDocument
            }
          });
        } 
        else  {        
          createPage({
            path: node.fields.slug,
            component: path.resolve(template),
            context: {// Data passed to context is available in page queries as GraphQL variables.
              slug: node.fields.slug,   
              shortTitle: node.fields.shortTitle,
            }
          });
        } 
      });
      resolve();
    })//.catch(e=>console.log(e));
  });
};
