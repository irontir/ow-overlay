import {environment} from "../config/environment.js"
const link = window.location.href;
class classData {
  constructor(typeClass){
    this.rank = typeClass.rank;
    this.rank_img = typeClass.rank_img;
    this.startRankImg = typeClass.rank_img;
    this.startRank = typeClass.rank;
  }
}
export default class OwProfile{
  element
  counter = 1;
  dmg = null
  sup = null
  tank = null
  params = null
  constructor(){
    this.render();
    this.getParams;
    this.getProfile();
  }
  get emptyTemplate(){
    return `
    <div style="display: flex; flex-direction: row; align-items: center;">
      <div>
        <img src="https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-BronzeTier.png" width="30" height="30">
      </div>
      <div>
        <span>0</span>
      </div>
    </div>
    `
  }
  generateDataRow(role, ico){
    return `
    <div class="sr" style="display: flex; flex-direction: row; align-items: center;">

      <div>
        <img src=${ico} width="15" height="15">
      </div>
      <div>
        <img src=${role.startRankImg} width="30" height="30">
      </div>
      <div>
        <span> ${role.startRank} </span>
      </div>
      <div>
        <img src=${role.rank_img} width="30" height="30">
      </div>
      <div>
        <span> ${role.rank}</span>
      </div>
      <div>
        <span style="color: ${this.calculateDiff(role) > 0 ? "green" : "red"}"> ${this.calculateDiff(role)} </span>
      </div>
    </div>
    `
  }

  async getProfile(){
    const reponse = await fetch(environment.url + this.params.user)
    if(reponse.ok){
      const profile = await reponse.json();
      if(!this.dmg || !this.tank || !this.sup){
        this.fillRoles(profile.competitive)
        this.update()
      } else {
        this.updateRoles(profile.competitive)
      }
      setTimeout(() => {
        this.getProfile()
      }, 60000);     
    }
  }

  render(){
    const elem = document.createElement('div')
    elem.innerHTML = this.emptyTemplate
    this.element = elem; 
  }

  fillRoles(profile){
    this.dmg = new classData(profile.damage)
    this.tank = new classData(profile.tank)
    this.sup = new classData(profile.support)
  }

  updateRoles(profile){
    this.updateRole(this.dmg, profile.damage)
    this.updateRole(this.tank, profile.tank)
    this.updateRole(this.sup, profile.support)
  }

  updateRole(role, profile){
    if(role.rank != profile.rank){
      role.rank = profile.rank;
      role.rank_img = profile.rank_img;
      this.update()
    }
  }
  get getParams(){
    this.params = window
    .location
    .search
    .replace('?','')
    .split('&')
    .reduce(
        function(p,e){
            var a = e.split('=');
            p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
            return p;
        },
        {}
    );
    console.log(this.params)
  }
  update(){
    const roleIcoLink = environment.roleIcoLink
    switch (this.params.typeRole){
      case "dd":
        this.element.innerHTML = this.generateDataRow(this.dmg, roleIcoLink.dd)
        break;
      case "tank":
        this.element.innerHTML = this.generateDataRow(this.tank, roleIcoLink.tank)
        break;
      case "sup":
        this.element.innerHTML = this.generateDataRow(this.sup, roleIcoLink.sup)
        break;
      default:
        const allRoles = this.generateDataRow(this.tank, roleIcoLink.tank) + this.generateDataRow(this.dmg, roleIcoLink.dd) + this.generateDataRow(this.sup, roleIcoLink.sup)
        this.element.innerHTML = allRoles;
        break;
    }
  }
  calculateDiff(role){
    return role.rank - role.startRank
  }

  remove(){
    this.element.remove();
  }
}