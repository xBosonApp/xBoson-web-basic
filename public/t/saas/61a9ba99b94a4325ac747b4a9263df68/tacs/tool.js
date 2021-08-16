/* Create By xBoson System */

module.exports = {
  getTHREE,
};


async function getTHREE(...libs) {
  const BASE = "cdn/three.js/0.131.3";
  let THREE = await require(BASE +"/three.min.js", 1, 0, 1);
  window.THREE = THREE;
  
  for (let i=0; i<libs.length; ++i) {
    await require(BASE + libs[i], 1,0,1);
  }
  // window.THREE = 'removed';
  return THREE;
}