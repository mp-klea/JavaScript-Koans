const SAMURAIPRINCIPLE = {};
(function () {
  const fetchJson = function (url) {
    return fetch(url).then(response => response.json());
  };
  SAMURAIPRINCIPLE.PlayerService = function () {
    this.getPlayer = function (playerId) {
      return fetchJson(`data/player/${playerId}.json`);
    };
  };
  SAMURAIPRINCIPLE.LeaderboardService = function () {
    this.getLeaderboard = function () {
      return fetchJson('data/leaderboard.json');
    };
  };
  SAMURAIPRINCIPLE.BetterLeaderboardService = function () {
    this.getLeaderboard = function () {
      return fetchJson('data/leaderboard.json');
    };
  };
}());

let playerService = new SAMURAIPRINCIPLE.PlayerService(),
  leaderboardService = new SAMURAIPRINCIPLE.LeaderboardService();
  betterLeaderboardService = new SAMURAIPRINCIPLE.BetterLeaderboardService();


playerService.getPlayer(1)
  .then(player => console.log('Player', player), reason => console.log(reason));
leaderboardService.getLeaderboard()
  .then(leaderboard => console.log('Leaderboard', leaderboard), reason => console.log(reason));

// best solution
var myFunction = function () {
  return betterLeaderboardService.getLeaderboard()
  .then(leaderboard => Promise.all(leaderboard.map(item => playerService.getPlayer(item.id))),
    reason => { console.log(reason); return Promise.reject(reason); }); // this will be logged as failure, without reject it's a pass
}
myFunction().then(result => console.log(result.map(item => item.name)), reason => console.log(reason));
