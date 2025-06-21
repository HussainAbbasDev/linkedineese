# LinkedInese Application: Actionable Development Steps

This document breaks down the creation of the LinkedInese application into a series of actionable, detailed steps. Each step is a prompt for a developer to implement a specific part of the project, from setup to deployment.

---

### **Step 1: Project Setup and Initial Configuration**

**Task:** Initialize a new Next.js project using the App Router, set up Tailwind CSS for styling, and create the initial file structure.

**Detailed Prompt:**

1.  **Initialize Next.js App:**
    Open your terminal and run the following command to create a new Next.js project. When prompted, use these settings:
    *   `What is your project named?` **linkedinese**
    *   `Would you like to use TypeScript?` **Yes**
    *   `Would you like to use ESLint?` **Yes**
    *   `Would you like to use Tailwind CSS?` **Yes**
    *   `Would you like to use 'src/' directory?` **No**
    *   `Would you like to use App Router?` **Yes**
    *   `Would you like to customize the default import alias?` **No**

    ```bash
    npx create-next-app@latest
    ```

2.  **Install Additional Dependencies:**
    Navigate into your project directory (`cd linkedinese`). While not strictly needed yet, install `lucide-react` for quality icons we'll use later.
    ```bash
    npm install lucide-react
    ```

3.  **Verify & Create File Structure:**
    Ensure your project has the `app/` directory. Within it, create the following structure. If any files or folders don't exist, create them.
    *   `app/page.tsx` (Main UI page)
    *   `app/layout.tsx` (Root layout)
    *   `app/globals.css` (Global styles)
    *   `app/api/linkedinify/route.ts` (Backend API endpoint)
    *   `components/` (Directory for reusable components)
    *   `documentation/` (Directory for project documentation)

4.  **Google Fonts Setup:**
    Open `app/layout.tsx`. Import the 'Poppins' font from `next/font/google` and apply it to the `<body>` tag to ensure it's used throughout the application.

---

### **Step 2: Implement the Frontend User Interface**

**Task:** Build the main user interface in `app/page.tsx` according to the specified design language, focusing on a modern, mobile-responsive layout that mirrors Google Translate's user experience.

**Detailed Prompt:**

**File:** `app/page.tsx`

1.  **Component Structure:**
    *   Create a React client component (`'use client'`).
    *   The main container should be a flexbox column (`flex flex-col`), centered on the page (`items-center`), with padding for spacing (`p-4` or `p-8`).

2.  **Header:**
    *   Add a centered `<h1>` tag with the text "LinkedInese Generator". Style it with a large, bold font (e.g., `text-4xl font-bold`).
    *   Below it, add a `<p>` tag with the text "Convert casual updates into professional LinkedIn posts using AI." Style it with a smaller, lighter font color (e.g., `text-lg text-gray-500`).

3.  **Main Form Container:**
    *   Create a `div` that will hold the two text areas and the button.
    *   On desktop screens (medium and up, `md:`), it should be a flexbox row (`md:flex md:flex-row`).
    *   On mobile screens, it will default to a block or flex-column layout, which will stack the elements vertically.
    *   Use a `gap-4` to provide space between elements.

4.  **Input Text Area (Left Side):**
    *   Use a `<textarea>` element.
    *   **Placeholder:** Set the placeholder to "Enter your casual or raw text here".
    *   **Styling:**
        *   Give it a width of `w-full` and on desktop `md:w-1/2`.
        *   Apply generous padding (e.g., `p-4`).
        *   Use rounded corners (e.g., `rounded-lg`).
        *   Add a soft box shadow (e.g., `shadow-md`).
        *   Define a border (e.g., `border border-gray-200`).
        *   Ensure a minimum height (e.g., `min-h-[200px]`).
        *   Set a `focus:` state to change the border color for better UX.

5.  **Output Text Area (Right Side):**
    *   Use a `<textarea>` element.
    *   **Placeholder:** Set the placeholder to "Your polished LinkedIn-style output will appear here."
    *   **Read-Only:** Make this text area `readOnly`.
    *   **Styling:**
        *   Apply the exact same styling as the input text area for a symmetrical look.
        *   Wrap this `textarea` and the copy button in a `div` with `relative` positioning.
    *   **Copy Button:**
        *   Place a `<button>` inside the relative `div`.
        *   Position it at the top-right corner of the output box (e.g., `absolute top-2 right-2`).
        *   Use a clipboard icon from `lucide-react`.
        *   Style the button to be subtle, perhaps with a transparent background that gets a light gray on hover (`hover:bg-gray-100`), rounded corners, and padding.
        *   Add an `aria-label="Copy to clipboard"`.

6.  **Transform Button:**
    *   Use a `<button>` element with the text "Transform to LinkedInese".
    *   **Positioning:** This button should be visually between the two text areas. On mobile, it will appear naturally between the stacked boxes. On desktop, you can place it centered below the main form container.
    *   **Styling:**
        *   Give it a professional-looking background color (e.g., `bg-blue-600`) and a contrasting text color (`text-white`).
        *   Add padding (`py-2 px-6`), rounded corners (`rounded-lg`), and a hover effect (`hover:bg-blue-700`).
        *   Include a `disabled` state style (e.g., `disabled:bg-gray-400`).

---

### **Step 3: Add State Management and Client-Side Logic**

**Task:** Wire up the UI in `app/page.tsx` with React state hooks to manage user input, AI output, loading status, and potential errors.

**Detailed Prompt:**

**File:** `app/page.tsx`

1.  **Import `useState`:** Make sure `useState` is imported from React.
2.  **Define State Variables:** At the top of your component function, define the following state variables:
    ```typescript
    const [input, setInput] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    ```
3.  **Bind State to UI Elements:**
    *   Bind the `input` state to the value of the input `<textarea>` and use its `onChange` event to call `setInput(e.target.value)`.
    *   Bind the `output` state to the value of the output `<textarea>`.
    *   Bind the `disabled` attribute of the "Transform to LinkedInese" button to the `isLoading` state.
4.  **Create `handleSubmit` Function:**
    *   Create an `async` function named `handleSubmit`.
    *   Attach this function to the `onClick` event of the "Transform" button.
    *   Inside the function, immediately set the state for a new request:
        ```typescript
        setIsLoading(true);
        setError('');
        setOutput('');
        ```
    *   Add a `try...catch...finally` block. Inside the `finally` block, ensure you always call `setIsLoading(false)`.
5.  **Conditional Rendering:**
    *   Create a `<Spinner />` component in `components/Spinner.tsx`.
    *   In `app/page.tsx`, conditionally render the spinner next to the "Transform" button text when `isLoading` is true.
    *   Conditionally render an error message (e.g., a `<p>` tag with red text) if the `error` state is not empty.

---

### **Step 4: Implement the Backend API Route**

**Task:** Create the server-side logic in `app/api/linkedinify/route.ts` to handle requests, validate input, and prepare the prompt for the DeepSeek V3 API.

**Detailed Prompt:**

**File:** `app/api/linkedinify/route.ts`

1.  **Create the POST Handler:**
    *   Export an `async` function named `POST` that accepts a `Request` object.
    *   This function will handle all incoming `POST` requests to `/api/linkedinify`.
2.  **Parse and Validate Input:**
    *   In a `try...catch` block, parse the request body: `const { text } = await req.json();`.
    *   Check if `text` exists and is a string.
    *   Add validation: If `text` is empty or its length is over a certain limit (e.g., 5000 characters), return a `Response.json({ error: 'Invalid input' }, { status: 400 })`.
3.  **Construct the Prompt:**
    *   Define a `systemMessage` string that instructs the AI on its role and desired output style.
    *   Define a `fewShotExamples` array of objects, where each object has a `user` and `assistant` message, to show the AI exactly what to do.
    *   Create the final prompt payload to be sent to the DeepSeek API, combining the system message, few-shot examples, and the user's validated `text`.
4.  **API Call Placeholder:**
    *   Add a comment placeholder: `// TODO: Call DeepSeek API with the constructed prompt`.
    *   For now, you can return a mock success response to test the frontend:
        ```typescript
        return Response.json({ result: 'This is a mocked AI response.', timing_ms: 500 });
        ```
5.  **Error Handling:**
    *   The `catch` block should log the error to the console for debugging and return a generic server error response: `Response.json({ error: 'Internal Server Error' }, { status: 500 })`.

---

### **Step 5: Connect Frontend, Backend, and AI Service**

**Task:** Complete the `fetch` call in the frontend's `handleSubmit` function and implement the real `fetch` call to the DeepSeek API in the backend.

**Detailed Prompt:**

1.  **Frontend (`app/page.tsx`):**
    *   Inside the `try` block of your `handleSubmit` function, add the `fetch` call:
    ```typescript
    const response = await fetch('/api/linkedinify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input }),
    });
    if (!response.ok) {
      throw new Error('Failed to transform text.');
    }
    const data = await response.json();
    setOutput(data.result);
    ```

2.  **Backend (`app/api/linkedinify/route.ts`):**
    *   Replace the API call placeholder with the actual `fetch` call to the DeepSeek V3 API endpoint.
    *   Read the API key and base URL from environment variables: `process.env.DEEPSEEK_API_KEY` and `process.env.DEEPSEEK_API_BASE_URL`. **Do not hardcode them.**
    *   Construct the full API endpoint URL: `${process.env.DEEPSEEK_API_BASE_URL}/chat/completions`.
    *   Construct the `Authorization: Bearer ${apiKey}` header.
    *   Send the full prompt in the request body.
    *   Await the response, parse the result, and extract the generated text from the correct path in the response JSON (e.g., `data.choices[0].message.content`).
    *   Return the real result in the `Response.json` payload.

---

### **Step 6: Configure Environment and Security**

**Task:** Securely manage the DeepSeek API key and base URL using environment variables and ensure they are not exposed to the public.

**Detailed Prompt:**

1.  **Create `.env.local`:** In the root of your project, create a file named `.env.local`.
2.  **Add Environment Variables:** Inside `.env.local`, add your API key and the base URL:
    ```
    DEEPSEEK_API_KEY="your_secret_api_key_here"
    DEEPSEEK_API_BASE_URL="https://api.deepseek.com"
    ```
3.  **Update `.gitignore`:** Open the `.gitignore` file and ensure that `.env.local` is listed. This is critical to prevent your secrets from being committed to version control.
4.  **Vercel/Deployment:** When you deploy your application to a service like Vercel, you must add both `DEEPSEEK_API_KEY` and `DEEPSEEK_API_BASE_URL` as environment variables in the project settings on the Vercel dashboard. 