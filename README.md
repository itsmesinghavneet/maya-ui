MAYA UI
--------
### Development Setup:
Prerequisites:
1. Ubuntu 16.10
2. Curl
```bash
  * sudo apt-get install curl
```
3. Node js
```bash
  * curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
  * sudo apt-get install -y nodejs
```
4. Bower
```bash
  * sudo npm install -g bower
```
5. Git
```bash
  * sudo apt-get install git
```
6. Yarn
```bash
  * curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
  * echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  * sudo apt-get update && sudo apt-get install yarn
```
7. Ember
```bash
  * npm install -g ember-cli
```

Setup:
```bash
  git clone 'https://github.com/cloudbytestorage/maya-ui'
  cd 'maya-ui'
  ./scripts/update-dependencies
```

Run development server:
```bash
  yarn start
```
PR rules:
  1. Run maya-ui project in devlopment setup.
  2. Make your changes.
  3. Resolve linting error.
  
(Q) How to resolve linting error?<br/>
(A) Install phantomjs if not present ``` sudo npm install -g --save eslint```. Check if there is linting error or not by running eber test. Resolve linting error using command eslint --fix ./file_path.

4. Do not hardcode any text in the hbs(template.hbs) file. Please use translator file for putting UI text strings.<br/>
      **Following are the instructions to use yaml translator**<br/>
   1. Goto maya-ui->translations->en-us.yaml<br/>
   2. Find the section ####MAYA STARTS#####.
      (We should write required things between 'MAYA STARTS' and 'MAYA ENDS' section.See Following:)<br/>
      ```
      ############MAYA STARTS##############
      <--You should write here-->
      ############MAYA ENDS################
      ```     
   3. There is already exisiting components(nothing but yaml key value pair) for exisiting screens.
   For example for cluster dashboard, organization, admin-panel etc.If you are wtirting a new screen 
   feel free to add your components but please follow semantics and order which you can understand by
   seeing the exsiting components<br/> 
   4. **Following is example, how yaml translator works:**<br/>
   If following content is in your yaml file:
```yaml
         homepage:
          title: Mayaonline
          header:
           header1: Cross Cloud Data Plane
          subHeader:
           subHeader1: Cmotion Magic
          generic:
           edit: Edit
```
   You can render the string in hbs file using following syntax:

```html
         {{t 'homepage.title'}}   <!--Returns Mayaonline-->
         {{t 'homepage.generic.edit'}}    <!--Returns edit-->
```
   You can pass the returned strings to handlebar helpers in following way:
```html
         {{lower-case (t 'homepage.header.header1')}} <!--Returns 'cross cloud data plane'-->
         {{upper-case (t 'homepage.header.header1')}} <!--Returns 'CROSS CLOUD DATA PLANE'-->
```
   **NOTE** : You need to write your own helpers(e.g. lower-case and upper-case used here have already been written)
              These helpers are part of ember and not of this translator.<br/>
**You can write dynamic contents and select texts in following ways**<br/>
Suppose you have following yaml:
```yaml
homepage:
 cluster: |
   {singularity, plural,
   =1 {Cluster}
   =0 {Clusters}
   other {Clusters}}
 dynamic: I am dynamic {variable}
 generic: Delete
```
See following,how you render in hbs:
```html
{{t 'homepage.cluster' singularity=1}} <!--Returns 'Cluster'-->
{{t 'homepage.cluster' singularity=0}} <!--Returns 'Clusters'-->
{{t 'homepage.cluster' singularity=5}} <!--Returns 'Clusters'-->
{{t 'homepage.dynamic' variable='programmer'}} <!--Returns 'I am dynamic programmer'-->
``` 
**Using text from translator yaml in Ember Javascript** <br/>
**Note:Pease Avoid using text from yaml in javascript unless it is so required or we are setting some DOM object for view using javascript**<br/>
**We already have a constants.js file(app->util->constants.js) for that pupose.** 
```javascript
//Ember component js file
import Ember from 'ember';
export default Ember.Component.extend(ModalBase, {
    intl: Ember.inject.service(), //intl service needs to be injected for using translator
    //intl service can be injected in js files of route,controller,service etc in ember
    actions: {
    transAlert(){
    let text1=this.get('intl').t('homepage.cluster',{singularity:1}); //see the just above yaml
    alert(text1); // Alerts  'Cluster'
    let text2=this.get('intl').t('homepage.cluster',{singularity:0});
    alert(text2); // Alerts 'Clusters'
    let text3=this.get('intl').t('homepage.dynamic',{variable:'coder'})
    alert(text3);//Alerts 'I am dynamic coder'
    let text4=this.get('intl').t('homepage.generic')
    alert(text4);//Alerts 'Delete'
      }
    }
});
```
            
### Deployment: How to?

- Currently it goes inside the monolith container image maya-io-server but in coming days it will be running in it's own container, called `dist-ui`.

(Q) How to build the image with the distributable ui?
(A) Run `make`

(Q) How it works?
(A) It sees if mayadata-io/build-ui:0.1 exists on the system, if it doesn't it creates it.

**Build environment** to de-couple the UI from the monolith
- There are two containers
`mayadata-io/build-ui:0.1` as the cached build environment for building the dist image
`mayadata-io/dist-ui:<7-char-commit-hash>` as the **actual distributable ui**


### Bugs & Issues
Please submit bugs and issues to [cloudbytestorage/maya-ui](//github.com/cloudbytestorage/maya-ui/issues)


#### Useful links
