## 5-What is the Node.js Thread Pool and How to Set the Thread Pool Size?
JavaScript execution in Node.js normally runs on a single main thread, but Node.js/Libuv can use additional threads, including a thread pool, for certain operations.
### The default thread pool size is:4
### You can change it using:

**process.env.UV_THREADPOOL_SIZE** = 8;

This should be set before operations that use the thread pool are started.



## 6. How Does Node.js Handle Blocking and Non-Blocking Code Execution?
Node.js runs JavaScript on a **single main thread**. If that thread gets blocked waiting for a slow operation (like reading a file, querying a database, or making a network request), it cannot do anything else in the meantime — including handling other incoming requests.

Non-blocking (asynchronous) code solves this by letting Node.js **start an operation and move on immediately**, instead of freezing execution until the operation completes. The actual I/O work is handled in the background (via the operating system and Node's event loop), and a callback, promise, or `async/await` is used to handle the result once it's ready.

### Key reasons non-blocking code matters:

- **Scalability** — A single Node.js process can handle thousands of concurrent connections because it isn't stuck waiting on any one of them.
- **Efficient resource use** — The CPU isn't idle while waiting for slow I/O (disk, network, database); it can process other tasks in that time.
- **Better performance under load** — Blocking operations create a queue where every other request has to wait its turn, causing major slowdowns as traffic increases.
- **Matches Node.js's design philosophy** — Node.js was built around an event-driven, non-blocking I/O model specifically to avoid the overhead of creating a new thread for every request (unlike traditional multi-threaded servers).

### In short:
Non-blocking code allows Node.js to stay responsive and handle many operations "at once" (concurrently, not in parallel) using a single thread — making it well-suited for I/O-heavy applications like web servers, APIs, and real-time apps.