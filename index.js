
const { App} = require('@slack/bolt');
  require("dotenv").config();
  const axios = require('axios');




  // Initializes your app with your bot token and signing secret
  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SIGNING_SECRET,
	appToken: process.env.SLACK_APP_TOKEN,
	socketMode: true
  });

//   function delay(milliseconds){
//     return new Promise(resolve => {rs
//         setTimeout(resolve, milliseconds);
//     });
// }

// initialize a map to store the comic names and numbers

const list = new Map();
  const api_url = 'https://xkcd.com/info.0.json'

async function getComicByNames() {
	  let req = await axios.get(api_url);
	 const { num } = req.data
	 let comicNum = parseInt(num + 1)
	 console.log(comicNum)

// for loop to get all the comics
for (let i = 1; i < comicNum; i++) {
	if (i == 404) {
		i++
	}
		let url = `https://xkcd.com/${i}/info.0.json`
		let response = await axios.get(url);
		const comicnmber = response.data.num
		const comicTitle = response.data.title
		list.set(comicTitle, comicnmber)
		// if i = 400, break the loop
	

}
}

getComicByNames();
// send a request
  app.command('/comic', async ({ command, ack, say, }) => {
    await ack();
    let req = await axios.get(api_url);
     const { num } = req.data

    let comicRequest = command.text;
    const numbers = /^[0-9]+$/; // yes this is a regexp



    if (comicRequest.match(numbers)) {
		console.log(command.user_id)
      let id = parseInt(comicRequest)
      console.log(comicRequest)
      const id_url = `https://xkcd.com/${id}/info.0.json`
      console.log(id)
      console.log(id_url)
        let response = await axios.get(id_url);
     const { title, alt, month, num, img} = response.data
await say({
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": `${title}`,
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": `${alt}`,
				"emoji": true
			}
		},
		{
			"type": "image",
			"image_url": `${img}`,
			"alt_text": `${alt}`
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "plain_text",
					"text": ` Comic number: ${num}`,
					"emoji": true
				}
			]
		}
	]
}

)
}
    else if (comicRequest == "random") {
		try {
     let response = await axios.get(api_url);
     let { num } = response.data
     console.log(num)
    let comicNum = parseInt(num + 1)
    console.log(comicNum)
    let randomComic = Math.floor(Math.random() * comicNum)
    console.log(randomComic)

  let url = `https://xkcd.com/${randomComic}/info.0.json`
 console.log(url)
    let req = await axios.get(url);
     const { title, alt, month, img} = req.data
await say({
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": `${title}`,
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": `${alt}`,
				"emoji": true
			}
		},
		{
			"type": "image",
			"image_url": `${img}`,
			"alt_text": `${alt}`
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": ` Comic number: ${randomComic}, requested by: <@${command.user_id}>`
				}
			]
		}
	]
}
)
		} catch (error) {
			console.log(error)
		}


    }

// else if comicRequest is "name", search the map for the name and return the comic

    else if (comicRequest == "LATEST" || "latest") {
 await say(`${command.user.name} requested today's comic`)
}

else {
await say("Please try again, that doesn't look like a vaild input")

}


  });

  // Start your app
  (async () => {
	await app.start()
  })();