const {PubSub} = require('@google-cloud/pubsub');

const pubSubClient = new PubSub();
const PublisherService = {
  sendMessage: async (topicName, message) => {
    const dataBuffer = Buffer.from(message);

    try {
      const messageId = await pubSubClient
          .topic(topicName)
          .publishMessage({data: dataBuffer});
      console.log(`Message ${messageId} published.`);
    } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
    }
  },
};

module.exports = PublisherService;
