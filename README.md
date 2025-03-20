# C.A.D.E. - Comprehensive Automated Digital E-butler

## Description

CADE is a multifaceted backend application designed to streamline communication and project management tasks. Originally developed to handle messages from a contact form in a web portfolio, CADE now boasts a robust Discord bot feature. This bot extends the application's capabilities into the realm of Discord, facilitating seamless message management and real-time engagement with your audience or team members.

## Features

-   **Contact Form Message Management**: CADE elevates the standard functionality of message handling by not only securely storing and cataloging messages received from a web portfolio's contact form but also engaging in intelligent conversation. Here’s a breakdown of the workflow:

    -   **Reception**: On receiving a message, CADE securely logs and stores it within the MongoDB database for easy access and management.
    -   **Interaction with ChatGPT**: CADE then forwards the message to ChatGPT, which formulates a contextually relevant response based on the inquiry.
    -   **Automated Email Response**: Once the response is parsed and tailored, CADE dispatches it via email, ensuring a timely and thoughtful reply to the initial contact.

-   **Discord Bot Integration**: Engage with users directly through Discord, with features that include:

    -   Automated responses and interactive communication
    -   Pull Request (PR) tracking from GitHub with updates and status reports within your Discord channels

-   **Session Tracking & User Interaction Logging**: CADE now provides real-time session tracking, enabling deeper insights into user interactions.
    -   **Event Logging**: Tracks user activity such as clicks and navigation events.
    -   **Session Management**: Associates events with unique session IDs, allowing historical tracking and analysis.
    -   **Referral Tracking**: Logs where users originate from (e.g., direct, social media, search engines).
    -   **User Agent Storage**: Records browser and device details to optimize user experience analysis.
    -   **Real-Time Event Processing**: Enables further analytics or integrations with dashboards to monitor activity.

## Documentation

For detailed information on the API routes and functionality, refer to the [CADE API Documentation](documentation.md).

## Future Enhancements

The following are some ideas for features that could be added to CADE in the future:

-   **Automated Responses**: Set up your backend to automatically respond to specific requests. Utilize a language model like ChatGPT to generate predetermined responses based on keywords.

-   **Enhanced GitHub Integration**: Extend CADE’s GitHub capabilities beyond PR tracking and Discord notifications by:

    -   Passing PRs through ChatGPT or another LLM to generate **personalized summaries**.
    -   Providing **code suggestions or fixes** based on PR content.
    -   Offering **AI-powered insights** into PRs, such as potential improvements, security risks, or architectural concerns.

-   **Advanced Session Analytics**: Expand the session tracking feature with:
    -   **Heatmaps & Clickstream Analysis**: Visualizing user behavior for better UI/UX decisions.
    -   **Anomaly Detection**: Identifying unusual user patterns or potential security risks.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js
-   MongoDB

### Installing

1. Clone the repository to your local machine.

2. Install the necessary packages.
    ```bash
    npm install
    ```
3. Create a `.env` file in the root of the project and add the following environment variables:
    ```env
    MONGODB_URI=<Your MongoDB Connection String>
    ALLOWED_ORIGIN=<URL of the client-side application>
    OPENAI_API_KEY=<Your open api key>
    RESEND_API_KEY=<your Resend api key>
    FROM_EMAIL=<the email to send from(add domain first)>
    DISCORD_BOT_TOKEN=<Your Discord Bot Token>
    DISCORD_CLIENT_ID=<Your Discord Client ID>
    GITHUB_API_TOKEN=<Your GitHub API Token>
    ```
4. Start the server
   `bash
npm run start
`
   The server should now be running at `http://localhost:3000`.

## Running the Tests

To run the automated test suite, run:

```bash
npm run test
```

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
