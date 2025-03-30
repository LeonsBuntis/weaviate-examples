import { WeaviateClient, vectorizer, generative } from 'weaviate-client';

const collectionName = 'Question';

const ensureCollectionExists = async (client: WeaviateClient) => {
    const exists = await client.collections.exists(collectionName);
    if (exists) {
        return;
    }

    await client.collections.create({
        name: collectionName,
        vectorizers: vectorizer.text2VecOllama({
            apiEndpoint: 'http://host.docker.internal:11434',
            model: 'nomic-embed-text',
        }),
        generative: generative.ollama({
            apiEndpoint: 'http://host.docker.internal:11434',
            model: 'llama3.2',
        }),
    });

    // Load data
    async function getJsonData() {
        const file = await fetch(
            'https://raw.githubusercontent.com/weaviate-tutorials/quickstart/main/data/jeopardy_tiny.json'
        );
        return file.json();
    }

    // Note: The TS client does not have a `batch` method yet
    // We use `insertMany` instead, which sends all of the data in one request
    async function importQuestions() {
        const questions = client.collections.get('Question');
        const data = await getJsonData();
        const result = await questions.data.insertMany(data);
        console.log('Insertion response: ', result);
    }

    await importQuestions();
}

export default {
    collectionName,
    ensureCollectionExists
}