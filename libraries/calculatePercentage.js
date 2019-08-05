module.exports = function(colleted, goal) {
  return (colleted/goal) > 1 ? 100 : Math.floor((colleted/goal)*100);
}
