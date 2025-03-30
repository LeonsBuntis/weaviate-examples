import { WeaviateClient } from 'weaviate-client';
import { readFileSync } from 'fs';
import image from '../collections/image';

export const nearTextExample = async (client: WeaviateClient) => {
    await image.ensureCollectionExists(client);
    const imageCollection = client.collections.get(image.collectionName);

    const result = await imageCollection.query.nearText(
        'A cat',
        {
            limit: 3,
        }
    );

    console.log(JSON.stringify(result.objects, null, 2));
};

export const hybridExample = async (client: WeaviateClient) => {
    await image.ensureCollectionExists(client);
    const imageCollection = client.collections.get(image.collectionName);

    const result = await imageCollection.query.hybrid(
        'Orange cat',
        {
            limit: 3,
        }
    );

    console.log(JSON.stringify(result.objects, null, 2));
};

export const mediaSearchExample = async (client: WeaviateClient, imgPath: string, distance: number = 0.2) => {
    const base64String = Buffer.from(readFileSync(imgPath)).toString('base64');

    await image.ensureCollectionExists(client);
    const imageCollection = client.collections.get(image.collectionName);

    const result = await imageCollection.query.nearImage(
        base64String, 
        {
            limit: 3,
            distance: distance,
            returnProperties: [
                'title', 
                // 'picture',
            ], 
            returnMetadata: 'all'
        }
    );

    console.log(JSON.stringify(result.objects, null, 2));
};
