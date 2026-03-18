# Label N

Custom fits & RTW | South asian roots, global style


## Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
*   **Backend for E-commerce:** [Shopify](https://www.shopify.com/) (via Storefront API)
*   **Backend for User Data:** [Supabase](https://supabase.io/)
*   **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

Follow these instructions to set up the project for local development.

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 20.x or later)
*   [npm](https://www.npmjs.com/)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project by copying the example file:
    ```bash
    cp .env.local.example .env.local
    ```
    Then, fill in the values in `.env.local`. See the "Environment Variables" section below for more details.

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Deployment

This application is optimized for deployment on [Vercel](https://vercel.com/).

### Step-by-Step Guide

1.  **Sign up for Vercel:** Create a free account on [Vercel](https://vercel.com/).

2.  **Import your Git Repository:**
    *   From your Vercel dashboard, click "Add New... > Project".
    *   Import the Git repository for this project.

3.  **Configure the Project:**
    *   Vercel will automatically detect that this is a Next.js project and configure the build settings correctly.

4.  **Add Environment Variables:**
    *   In your Vercel project settings, navigate to the "Environment Variables" section.
    *   Add all the variables from your `.env.local` file. These will be securely stored and injected into the application.

5.  **Deploy:**
    *   Click the "Deploy" button. Vercel will build and deploy your application.

6.  **Add Custom Domain (`shoplabeln.com`):**
    *   After the deployment is successful, go to the "Domains" section in your Vercel project settings.
    *   Add `shoplabeln.com` as a custom domain.
    *   Vercel will provide you with DNS records. Update these records in your domain registrar's settings to point your domain to Vercel.
    *   Vercel will automatically handle the SSL certificate.

## Environment Variables

The following environment variables are required for the application to run.

*   `NEXTAUTH_URL`: The canonical URL of your deployed application. For local development, this is `http://localhost:3000`.
*   `NEXTAUTH_SECRET`: A random string used to sign tokens. You can generate one with `openssl rand -base64 32`.
*   `SUPABASE_URL`: Your Supabase project URL.
*   `SUPABASE_ANON_KEY`: Your Supabase public `anon` key.
*   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase secret `service_role` key.
*   `SHOPIFY_STORE_DOMAIN`: Your Shopify store domain (e.g., `your-store.myshopify.com`).
*   `SHOPIFY_STOREFRONT_ACCESS_TOKEN`: Your Shopify Storefront API access token.
