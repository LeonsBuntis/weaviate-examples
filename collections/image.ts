import weaviate, { WeaviateClient } from 'weaviate-client';
import { readFileSync, readdirSync } from 'fs';

const collectionName = 'Images';

const ensureCollectionExists = async (client: WeaviateClient) => {
    const exists = await client.collections.exists(collectionName);
    if (exists) {
        return;
    }

    await client.collections.create({
        name: collectionName,
        properties: [
            {
                name: 'title',
                dataType: 'text' as const,
            },
            {
                name: 'picture',
                dataType: 'blob' as const,
            },
        ],
        vectorizers: [
            weaviate.configure.vectorizer.multi2VecClip({
                name: 'title_vector',
                imageFields: [
                    {
                        name: 'picture',
                        weight: 0.9,
                    },
                ],
                textFields: [
                    {
                        name: 'title',
                        weight: 0.1,
                    },
                ],
            }),
        ],
    });
}

const loadData = async (client: WeaviateClient) => {
    await ensureCollectionExists(client);

    const imageCollection = client.collections.get(collectionName);

    const imgFolder = './img';
    const files = readdirSync(imgFolder);

    const mmSrcObjects = files.map(file => {
        const img = readFileSync(`${imgFolder}/${file}`);
        const b64 = Buffer.from(img).toString('base64');
        return {
            title: file.split('.')[0],
            picture: b64,
        };
    });

    const result = await imageCollection.data.insertMany(mmSrcObjects);

    console.log(result);
}

const reset = async (client: WeaviateClient) => {
    await client.collections.delete(collectionName);

    await loadData(client);
}

export default {
    collectionName,
    ensureCollectionExists,
    loadData,
    reset
}