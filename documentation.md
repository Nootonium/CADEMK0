# **CADE API Documentation**

## **Overview**

CADE provides a set of endpoints for handling messages, tracking user interactions, and integrating GitHub PR events into Discord. Below is a breakdown of the available API routes.

---

## **Health Check**

### **GET /health**

#### **Description**

Checks if the server is running and healthy.

#### **Response**

-   **200 OK** – `{ "status": "UP" }`

---

## **Message Handling**

### **POST /message**

#### **Description**

Stores a message received from a contact form.

#### **Request Body**

| Field   | Type   | Required | Description            |
| ------- | ------ | -------- | ---------------------- |
| name    | string | ✅       | Name of the sender.    |
| email   | string | ✅       | Must be a valid email. |
| message | string | ✅       | Message content.       |

#### **Validation Rules**

-   `name` is required.
-   `email` must be a valid email address.
-   `message` is required.

#### **Responses**

-   **201 Created** – `{ "message": "Message saved successfully" }`
-   **400 Bad Request** – `{ "error": "Validation errors" }`
-   **500 Internal Server Error** – `{ "error": "Internal server error" }`

---

## **User Session Tracking**

### **POST /track**

#### **Description**

Logs a user interaction event associated with a session.

#### **Request Body**

| Field          | Type   | Required | Description                                    |
| -------------- | ------ | -------- | ---------------------------------------------- |
| sessionId      | string | ✅       | Unique session identifier.                     |
| eventType      | string | ✅       | Must be `"section"` or `"click"`.              |
| eventData      | object | ✅       | Details of the event.                          |
| referralSource | string | ❌       | Source of referral (e.g., "direct", "google"). |
| userAgent      | string | ❌       | Information about the user's browser/device.   |

#### **Responses**

-   **201 Created** – `{ "message": "Event saved", "sessionId": "<sessionId>" }`
-   **400 Bad Request** – `{ "error": "sessionId, eventType, and eventData are required" }`
-   **400 Bad Request** – `{ "error": "Invalid eventType" }`
-   **500 Internal Server Error** – `{ "error": "Internal server error" }`

---

### **GET /session/:sessionId**

#### **Description**

Retrieves details of a tracked session by session ID.

#### **Path Parameters**

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| sessionId | string | ✅       | The session identifier. |

#### **Responses**

-   **200 OK** – Returns the session document as JSON.
-   **404 Not Found** – `{ "error": "Session not found" }`
-   **500 Internal Server Error** – `{ "error": "Internal server error" }`

---

## **GitHub Webhook Integration**

### **POST /webhook/github**

#### **Description**

Processes GitHub webhook events, particularly for pull requests.

#### **Headers**

| Header          | Type   | Required | Description                                |
| --------------- | ------ | -------- | ------------------------------------------ |
| x-hub-signature | string | ✅       | GitHub webhook signature for verification. |

#### **Request Body**

Must include GitHub webhook payload. Example for a PR event:

```json
{
    "action": "opened",
    "pull_request": {
        "id": 123456,
        "title": "Fix bug",
        "user": { "login": "dev123" },
        "html_url": "https://github.com/repo/pull/123"
    }
}
```

#### **Responses**

-   **200 OK** – `"Event received"`
-   **401 Unauthorized** – `"Invalid signature"`
-   **500 Internal Server Error** – `{ "error": "Internal server error" }`

---

## **Notes**

-   The GitHub webhook expects a properly configured **secret key** to validate requests.
-   The `track` endpoint supports `section` and `click` event types.
-   Future enhancements may include AI-driven PR analysis.
