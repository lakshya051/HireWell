const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'hirewell-app',
  brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'hirewell-group' });

const runKafka = async () => {
  try {
    await producer.connect();
    console.log('Kafka Producer connected successfully');

    await consumer.connect();
    console.log('Kafka Consumer connected successfully');

    await consumer.subscribe({ topic: 'job-post-ai-tasks', fromBeginning: true });
    await consumer.subscribe({ topic: 'interview-ai-tasks', fromBeginning: true });
    await consumer.subscribe({ topic: 'shortlist-ai-tasks', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value.toString());
        console.log(`Received message on topic ${topic}:`, data);
        
        switch (topic) {
          case 'job-post-ai-tasks':
            // TODO: Implement the AI job post generation and DB save logic here.
            break;
          case 'interview-ai-tasks':
            // TODO: Implement the AI interview question generation/scoring logic here.
            break;
          case 'shortlist-ai-tasks':
            // TODO: Implement the AI shortlisting logic here.
            break;
        }
      },
    });

  } catch (error) {
    console.error('Kafka connection failed:', error);
  }
};

module.exports = {
  producer,
  consumer,
  runKafka
};