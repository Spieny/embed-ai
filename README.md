# Vercel AI SDK Demo

This repository showcases a simple yet powerful application built with the Vercel AI SDK, demonstrating its capabilities for integrating AI models into modern web applications, including advanced patterns like multi-agent systems and MCP integration.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)

---

## Introduction

The **Vercel AI SDK** is a free, open-source library that simplifies the process of building AI-powered applications and agents with JavaScript and TypeScript. This demo aims to provide a clear and runnable example of how to leverage the SDK's core functionalities, such as text generation, streaming responses, and integrating with various AI providers, alongside more complex architectures like multi-agent systems and integration with the Model Context Protocol (MCP).

---

## Features

* **Simple LLM Generation:** Demonstrates basic text generation, including direct `generate` calls for single responses and `streamText` for real-time, token-by-token output.
* **Structured Output Generation:** Shows how to use the SDK to generate structured JSON objects directly from LLMs, simplifying data parsing.
* **Multi-Agent System Workflow Patterns:** Explores common patterns for building applications where multiple AI agents collaborate to achieve a goal, showcasing communication and coordination between agents.
* **MCP Integration to LLM:** Illustrates how to integrate the LLM with MCP Server using Vercel AI SDK.
---

## Tech Stack

* [**Next.js**](https://nextjs.org/) - React framework for building full-stack web applications.
* [**Vercel AI SDK**](https://sdk.vercel.ai/) - The AI Toolkit for TypeScript.
* [**React**](https://react.dev/) - Frontend JavaScript library.
* [**Tailwind CSS**](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI development.
* **Gemini Generative AI Provider** (`@ai-sdk/google`)
* [**shadcn/ui**](https://ui.shadcn.com/) - Open Source Re-usable React components

---

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn or pnpm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/naufalpram/vercel-ai-sdk-demo.git](https://github.com/naufalpram/vercel-ai-sdk-demo.git)
    cd your-repo-name
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### Environment Variables

This project requires API keys for the AI providers you intend to use. Create a `.env.local` file in the root of your project and add the following:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
```

### Running Locally

Once you've installed the dependencies and set up your environment variables, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open http://localhost:3000 in your browser to see the application.
