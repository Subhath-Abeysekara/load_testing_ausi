import { MongoClient, ServerApiVersion } from 'mongodb'
import { user } from './types';
const uri = "mongodb+srv://cab432database:YewuTawiggVC8I9y@cluster1.8gftj.mongodb.net/?retryWrites=true&w=majority&appName=cluster1";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function run_user() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    return client.db('project').collection<user>('user')
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}

export async function run_video() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    return client.db('project').collection('video')
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}

export async function run_download() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    return client.db('project').collection('download')
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}

