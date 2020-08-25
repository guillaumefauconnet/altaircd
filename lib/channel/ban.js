module.exports = {
    isBanned(user) {
        return this.banned.some(function(ban) {
          return user.matchesMask(ban.mask);
        });
    },
    
    banMaskExists(mask) {
        return this.banned.some(function(ban) {
          return ban.mask === mask;
        });
    },
    
    findBan(mask) {
        for (let i in this.banned) {
          if (this.banned[i].mask === mask) {
            return this.banned[i];
          }
        }
    }
}
