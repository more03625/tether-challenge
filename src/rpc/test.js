const RPC = require('@hyperswarm/rpc')

async function startRPC() {
    const rpc = new RPC()
    const server = rpc.createServer()

    await server.listen()

    server.respond('echo', (req) => req)

    const client = rpc.connect(server.publicKey)
    const response = await client.request('echo', Buffer.from('hello world'))

    console.log(response.toString()) // Output: hello world
}

startRPC()
