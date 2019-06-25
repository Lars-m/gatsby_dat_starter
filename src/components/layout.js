import React from "react";
import Modal from "./Modal";
import logo from "../../images/logo.png";
import offline from "../../images/offline.svg";
//import logo from "../../images/logo.svg"
import { StaticQuery, Link, graphql } from "gatsby";
import { getDateFromDkDate } from "../helpers/date_utils";

import { navigate } from "gatsby"

import "../../images/css/font-awesome.css";
import "../../style.css";
import selectedPages from "../helpers/pagesForMenu";
import Select from "react-select";

class Container extends React.Component {
  constructor(props) {
    super(props);
    //necessary since first time it executes it's done by node and not in a browser
    this.state = { offline: false, showModal: false, selectedClass: null };
  }
 

  componentDidMount() {
    window.addEventListener("click", this.clicked);
    window.addEventListener("online", this.setOffline);
    window.addEventListener("offline", this.setOffline);
    this.setOffline();
    if(localStorage.selectedClass){
      const selectedClass = JSON.parse(localStorage.selectedClass);
      this.setState({selectedClass})
    }
  }
  componentWillUnmount() {
    window.removeEventListener("online", this.setOffline);
    window.removeEventListener("offline", this.setOffline);
    window.removeEventListener("click", this.clicked);
    this.setOffline();
  }

  /* Disable outgoing links when off-line */
  clicked = e => {
    if (this.state.offline && e.target.tagName.toUpperCase() === "A") {
      if (!e.target.getAttribute("href").startsWith("/")) {
        e.preventDefault();
        this.setState({ showModal: true });
        setTimeout(() => this.setState({ showModal: false }), 2000);
      }
    }
  };

  closeModal = () => this.setState({ showModal: false });
  setOffline = () => this.setState({ offline: !navigator.onLine });

  handleClassChange = (selectedClass) => {
    this.setState({ selectedClass });
    localStorage.selectedClass = JSON.stringify(selectedClass)
    //Check whether this can be done via the Router
    navigate(window.location.pathname);
    //console.log(`Option selected:`, selectedClass,window.location.pathname);
  }

  /*
  Find all sub-entries for this node. Include:
     - nodes that represents plain md-files in folder that holds the folder for the 
       menu-entry(node) that was clicked
     - index.md nodes for files that lives a level below the current node 
      (must end as a clickable menu entry to navigate into that folder)
  */
  setSubmenuForThisNodeX = (nodes, menuNode, level) => {
    if (!menuNode.fields.isIndex) {
      return; //menu-entries made from a plain md-file cannot have parents
    }
    const folder = menuNode.fields.inFolder;

    const menuEntries = nodes
      .filter(node => {
        if (node.fields.depth < level) {
          return false;
        }
        const { parentFolder, isIndex, inFolder, shortTitle } = node.fields;
        const isChildWithIndex = folder === parentFolder && isIndex;
        const isMdFileAndInFolder = !isIndex && inFolder === folder;
        const include = isMdFileAndInFolder || isChildWithIndex;
        
        if (include) {
          node.sortField = getDateFromDkDate(shortTitle)
            .toString()
            .toLowerCase();
        }
        return include;
      })
      .sort((a, b) => (a.sortField >= b.sortField ? 1 : -1));
    selectedPages.setPages(menuEntries, level);
  };

  render() {
    const data = this.props;
    const nodes = data.allMarkdownRemark.nodes;
    //console.log("Levels",nodesPerLevel(nodes))

    const plt = nodes
      // .filter(n => n.fields.isIndex && n.fields.depth === 1)
      .filter(n => n.fields.isIndex && n.fields.depth === 1)
      .sort((a, b) =>
        a.fields.shortTitle.toLowerCase() >= b.fields.shortTitle.toLowerCase()
          ? 1
          : -1
      );

    const subLinksHTML = selectedPages.getPages("LEVEL1").map(n => {
      return (
        <Link
          key={n.id}
          to={n.fields.slug}
          onClick={() => this.setSubmenuForThisNodeX(nodes, n, 2)}
          activeClassName="active"
          partiallyActive={true}
        >
          {n.fields.shortTitle}
        </Link>
      );
    });
    const subLinksLevel2HTML = selectedPages.getPages("LEVEL2").map(n => {
      return (
        <Link
          key={n.id}
          to={n.fields.slug}
          onClick={() => this.setSubmenuForThisNodeX(nodes, n, 3)}
          activeClassName="active"
        >
          {n.fields.shortTitle}
        </Link>
      );
    });

    const topLinks = data.site.siteMetadata.topMenu.map(l => {
      if (!(l.URL || l.route)) {
        throw new Error(
          "Either a URL or a route must be provided for a topMenu entry"
        );
      }
      return l.URL ? (
        <a key={l.title} href={l.URL} target="_blank" rel="noopener noreferrer">
          {" "}
          {l.title}
        </a>
      ) : (
        <Link
          key={l.title}
          to={l.route}
          onClick={() => selectedPages.resetSubMenus()}
          target="_blank"
          activeClassName="active"
        >
          {" "}
          {l.title}
        </Link>
      );
    });
    let pageLinksLevel1 = plt.map(p => (
      <Link
        key={p.id}
        to={p.fields.slug}
        onClick={() => this.setSubmenuForThisNodeX(nodes, p, 1)}
        activeClassName="active"
        partiallyActive={true}
      >
        {p.fields.shortTitle}
      </Link>
    ));
    const {classes} = data.site.siteMetadata
    const selected = this.state.selectedClass ? this.state.selectedClass.label : "";
    const background = this.state.selectedClass ? {backgroundColor:this.state.selectedClass.backgroundColor} : {}
    return (
      <div>
        <div className="header" style={background}>
          <div className="title">
            <img src={logo} alt="Logo" />
            <div style={{ alignSelf: "flex-start", marginLeft: "2em" }}>
              <h1>{data.site.siteMetadata.title1}</h1>
              <p>{data.site.siteMetadata.title2} - {selected}</p>
            </div>
            
          </div>
          <div className="main-links">
          
            {topLinks}
          </div>
        </div>

        <div className="content-frame">
          <div className="period-links">
          <div style={{width:130}}>
            <Select 
              value={this.state.selectedClass}
              onChange={this.handleClassChange}
              options={classes}
            />
            </div>
            {pageLinksLevel1}
            {/* HACK to ensure icon is preloaded while online*/}
            <img style={{ width: 1 }} src={offline} alt="dummy" />{" "}
            {this.state.offline && (
              <img className="online" src={offline} alt="off-line" />
            )}
          </div>
          <div className="link-days">{subLinksHTML}</div>
          <div className="link-days">{subLinksLevel2HTML}</div>
          <Modal
            key={this.state.showModal}
            header="Off-line"
            body="You are currently off-line"
            show={this.state.showModal}
            onClose={this.closeModal}
          />
          <div> {this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default ({ children }) => (
  <StaticQuery
    query={query}
    render={(data) => <Container {...data} children={children} />}
  />
);

var query = graphql`
  {
    allMarkdownRemark {
      nodes {
        id
        frontmatter {
          
          date
        }

        fields {
          slug
          inFolder
          isIndex
          depth
          shortTitle          
          parentFolder
        }
      }
    }
    site {
      siteMetadata {
        title1
        title2
        classes {
          value
          label
          backgroundColor
        }
        topMenu {
          title
          URL
          route
        }
      }
    }
  }
`;
