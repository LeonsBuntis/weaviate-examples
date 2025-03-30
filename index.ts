import weaviate, { WeaviateClient } from 'weaviate-client';
import * as TextExamples from './examples/text-examples';
import * as ClipExamples  from './examples/clip-examples';
import image from './collections/image';

const client: WeaviateClient = await weaviate.connectToLocal();

var clientReadiness = await client.isReady();

console.log("Client ready -> " + clientReadiness);

// await TextExamples.nearTextExample(client);

// await TextExamples.generateExample(client);

// await image.reset(client);
// await image.loadData(client);

// await ClipExamples.nearTextExample(client);

// await ClipExamples.hybridExample(client);

await ClipExamples.mediaSearchExample(client, './examples/img/white-ragdoll-cat.jpg');
await ClipExamples.mediaSearchExample(client, './examples/img/eiffel-tower.jpg');

client.close();