const { twitter, treshold, sleep } = require('./config')
const { ApiResponseError } = require('twitter-api-v2')

const main = async () => {
  const user = await twitter.v2.me()
  let likedTweets = await twitter.v2.userLikedTweets(user.data.id, { 'tweet.fields': 'created_at' })
  
  console.log("likedTweets.meta",likedTweets.meta)
  
  for await (const likedTweet of likedTweets) {
    try {
      if (Date.parse(likedTweet.created_at) <= treshold) {
        console.log(`Liking tweet ${likedTweet.id}`)
        await twitter.v2.like(user.data.id, likedTweet.id)
        console.log(`Unliking tweet ${likedTweet.id}`)
        await twitter.v2.unlike(user.data.id, likedTweet.id)
      }
    } catch (error) {
        console.log('rate limit hit')
        return
      }
  }
}


main().catch((e) => console.log(e))
