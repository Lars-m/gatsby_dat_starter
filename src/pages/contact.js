import React from "react"
import Layout from "../components/layout";
import  {findLinksMarkedWithTag} from "../helpers/tagFinder";
export default () => {
 test_findLinksMarkedWithTag();
 return  (
  <Layout>
    <h1>Teacher</h1>
    <h4>Lars Mortensen (lam)</h4>
    <p>
      <a href="mailto:lam@cphbusiness.dk">lam@cphbusiness.dk</a>
    </p>
  </Layout>
)
}

function test_findLinksMarkedWithTag(){
  const testString = `
  ---
  title: "Day-2, an introduction to maven"
  date: "29-01-2019"
  pageintro: |  
    Testing and Maven
  ---
  
  ### Before this lesson you should:
  
  <!--BEGIN readings ##-->
  - :book: [What is Maven (5 min.)](https://maven.apache.org/what-is-maven.html)
  - :book: [Maven in 5 min (expect to use at least 15 min. This is included in one of todays exercises)](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html)
  - :book: [Maven Getting Started Guide (15-20 min, bookmark for future reference)](https://maven.apache.org/guides/getting-started/index.html)
  <!--END readings ##-->
  
  ### Exercises
  <!--BEGIN exercises ##-->
  - [Getting started with Maven](https://docs.google.com/document/d/193QmOG5RIzCq1oTwMVKlCegWTT8lv7hmavqX6PxMLEM/edit?usp=sharing)
  - [Testing With Maven](https://docs.google.com/document/d/1tDz3rP4Li52nJSIqBgPo6PKLSpVtX56a-ygAHKdKNO0/edit?usp=sharing)
  <!--END exercises ##-->
  
  <!--BEGIN exercises_#_guides ##-->
  [Maven Guidelines for 3. semester](https://docs.google.com/document/d/1WhUccsbU7SzomqSKau30BcmfsvjBMCNDsWGohFFmyRI/edit)
  <!--END exercises_#_guides ##-->
  
  #### Guidelines
  <!--BEGIN guides ##-->
  - [Maven Guidelines for 3. semester](https://docs.google.com/document/d/1WhUccsbU7SzomqSKau30BcmfsvjBMCNDsWGohFFmyRI/edit)
  <!--END guides ##-->
  
  #### Slides
  <!--BEGIN slides ##-->
  [Maven Slides](https://docs.google.com/presentation/d/1o2c2haU7zM9M9U6tRW7drgRMObmWx-9oiCe2_6mPmRk/edit?usp=sharing)
  <!--END slides ##-->
  
  `;
  
  
  // console.log("GUIDES")
  // console.log(findMatchingTags(testString,"guides","XXX"));
  //console.log("EXERCISES")
  //console.log(findMatchingTags(testString,"exercises","XXX"));
  console.log(findLinksMarkedWithTag(testString,"exercises","XXX"));
}