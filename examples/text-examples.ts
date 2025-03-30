import weaviate, { WeaviateClient, vectorizer, generative } from 'weaviate-client';
import question from '../collections/question';

export const nearTextExample = async (client: WeaviateClient) => {

    await question.ensureCollectionExists(client);

    const questions = await client.collections.get(question.collectionName);

    // Simple example
    const result = await questions.query.nearText('biology', {
        limit: 2,
    });

    result.objects.forEach((item) => {
        console.log(JSON.stringify(item.properties, null, 2));
    });
}

export const generateExample = async (client: WeaviateClient) => {

    await question.ensureCollectionExists(client);

    const questions = await client.collections.get(question.collectionName);

    const result2 = await questions.generate.nearText(
        'biology',
        {
            groupedTask: 'Write a tweet with emojis about these facts.',
        },
        {
            limit: 2,
        }
    );
    
    console.log(result2.generated);
}