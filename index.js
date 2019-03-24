let axios = require('axios')
let config = require('./config')

let teamData = "";
let slackWebhookUrl = config.webHookUrl

let getLeaderboardData = (callback) => {
  axios.get(config.dataSourceUrl)
    .then((response) => {
      let entrants = response.data.leaderboard.leaderboard_entrants
      let newTeamData = JSON.stringify(entrants)
      if(newTeamData != teamData){
        teamData = newTeamData
        let messageString = createMessageString(entrants)
        console.log(messageString)
        axios.post(slackWebhookUrl, {
          text: messageString,
          channel: "#f1",
          username: "FormulaOP"
        }).then((response) => {
          console.log("Data sent to webhook\n")
        }).catch((error) => {
          console.error()
        })
      } else {
        console.log("No new data")
      }
      setTimeout(() => {callback(callback)}, 600000)
    })
    .catch((error) => {
      console.log(error)
      setTimeout(() => {callback(callback)}, 600000)
    })
}

let createMessageString = (entrants) => {
  let message = "*Ställningen i OP-F1 JUST NU!*\n*Namn*\t*Lag*\t*Poäng*\n"
  let index = 0
  entrants.forEach((entrant) => {
    let entrantRow = "" + ++index + ". "
      + entrant.first_name + "\t"
      + entrant.team_name + "\t*"
      + entrant.score + "*\n"
    message += entrantRow
  })
  return message
}

getLeaderboardData(getLeaderboardData)
