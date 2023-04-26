const { twitter, treshold, sleep } = require('./config')
const { ApiResponseError } = require('twitter-api-v2')

const main = async () => {
  const user = await twitter.v2.me({'user.fields': 'public_metrics'})
  const tweet_count = user.data.public_metrics.tweet_count
  console.log(`Tweet count: ${tweet_count}`)

  const tweets = await twitter.v2.userTimeline(user.data.id, { 'tweet.fields': 'created_at' })

  for await (const tweet of tweets) {
    try {
      if (Date.parse(tweet.created_at) <= treshold) {
        console.log(`Deleting tweet ${tweet.id}`)
        await twitter.v2.deleteTweet(tweet.id)
      }
    } catch (error) {
      if (error instanceof ApiResponseError && error.rateLimitError && error.rateLimit) {
        console.log('rate limit hit')
        return
      }

      throw error
    }
  }
}

main().catch((e) => console.log(e))
