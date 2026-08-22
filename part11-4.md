# Part 1: Node Internals

## 1. What is the Node.js Event Loop?

The **Event Loop** is the mechanism that allows Node.js to handle asynchronous operations without blocking the main thread.

It checks for completed asynchronous tasks and moves their callbacks to the **Call Stack** when they are ready to execute.

---

## 2. What is Libuv and What Role Does It Play in Node.js?

**Libuv** is a C library used by Node.js to handle asynchronous and non-blocking operations.

It provides:

- Event Loop
- Thread Pool
- File system operations
- DNS operations
- Networking

---

## 3. How Does Node.js Handle Asynchronous Operations Under the Hood?

When Node.js starts an asynchronous operation:

1. The operation is passed to **Libuv**.
2. Node.js continues executing other JavaScript code.
3. Libuv handles the operation using the operating system or its **Thread Pool**.
4. When the operation finishes, its callback is placed in the appropriate queue.
5. The **Event Loop** moves the callback to the Call Stack when it is ready.

---

## 4. What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js?

| Component | Description |
|---|---|
| **Call Stack** | Keeps track of the JavaScript functions currently being executed. |
| **Event Queue** | Stores callbacks that are ready to be executed. |
| **Event Loop** | Checks the Call Stack and queues, then moves callbacks to the Call Stack when it is empty. |

### Simple Flow

```text
Async Operation
      ↓
Event Queue
      ↓
Event Loop
      ↓
Call Stack
      ↓
Execute Callback