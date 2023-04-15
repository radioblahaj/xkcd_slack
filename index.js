
const { App} = require('@slack/bolt');
  require("dotenv").config();
  const axios = require('axios');




  // Initializes your app with your bot token and signing secret
  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SIGNING_SECRET,
	socketMode: true

  });


// send a request
  app.command('/comic', async ({ command, ack, say, }) => {
    await ack();
    console.log("hi")
    const api_url = 'https://xkcd.com/info.0.json'
    let req = await axios.get(api_url);
     const { num } = req.data

    let comicRequest = command.text;
    const numbers = /^[0-9]+$/;


    if (comicRequest.match(numbers)) {
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
					"type": "plain_text",
					"text": ` Comic number: ${randomComic}`,
					"emoji": true
				}
			]
		}
	]
}
)


    }

    else if (comicRequest == "LATEST" || "latest") {
 await say(`${command.user.name} requested today's comic`)
}

else {
await say("Please try again, that doesn't look like a vaild input")

}


  });

  // Start your app
  (async () => {
	// start on port 3000
	await app.start(process.env.PORT || 3000);
  })();