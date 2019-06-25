class PagesForMenu {
  constructor() {
    this.pages = {};
    this.pages.LEVEL1 = [];
    this.pages.LEVEL2 = [];
    this.pages.LEVEL3 = [];
  }
  resetSubMenus() {
    this.pages.LEVEL1 = [];
    this.pages.LEVEL2 = [];
  }

  /*  get Pages() {
    return this.pages;
  } */
  getPages(level) {
    const p = this.pages[level];
    //console.log("GET",p);
    return p;
  }
  setPages(p, level) {
    this.pages[`LEVEL${level}`] = p;
    if(level ===1){
      this.pages.LEVEL2 = [];
    }
  }
}
export default new PagesForMenu();
