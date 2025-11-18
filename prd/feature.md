Got it — here’s your **agent-optimized PRD template in Markdown (`.md`)** so you can reuse it for any product:

````markdown
# PRD — [Product Name] MVP

## 1. Overview
[One-paragraph description of the product. Include key functionality, user interactions, and constraints like onboarding or payment.]

---

## 2. System Goals
- [Goal 1: core outcome]
- [Goal 2: workflows to automate or improve]
- [Goal 3: monetization / business value]

---

## 3. Entities & Schemas

### Example: `users`
```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  phone text unique,
  created_at timestamptz default now()
);
````

### Example: `subscriptions`

```sql
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text check (status in ('active','canceled','past_due')),
  created_at timestamptz default now()
);
```

\[Add more entities as needed: `messages`, `tasks`, `reminders`, etc.]

---

## 4. Features

### 4.1 Onboarding & Payment

* **Signup:** \[Auth provider]
* **Phone Verification:**

  * Input: `{ phone_number }`
  * Output: `{ success: true, otp_sent: true }`
* **Payment:** Stripe/PayPal/etc → subscription sync

### 4.2 Channels / Interfaces

#### Web Chat

* Input: `{ user_id, message }`
* Output: `{ status: "stored", assistant_reply }`
* Flow:

  1. Store in DB
  2. Call LLM agent with context
  3. Save + return assistant reply

#### SMS (Twilio example)

* Input:

  ```json
  { "From": "+12025550123", "To": "+12025550999", "Body": "Remind me tomorrow at 9am" }
  ```
* Output:

  ```json
  { "status": "stored", "thread_id": "thread_123", "task_created": true }
  ```

#### Email

* Inbound: \[Webhook flow]
* Outbound: \[Gmail API, SMTP, etc.]
* Input: `{ from, to, subject, body }`
* Output: `{ status: "sent", message_id }`

### 4.3 Assistant Capabilities

* **Calendar**

  * Input: `{ action, title, time, attendees }`
  * Output: `{ success: true, event_id }`
* **Reminders**

  * Input: `{ message, remind_at }`
  * Output: `{ success: true, reminder_id }`
* **Calls**

  * Input: `{ to, message }`
  * Output: `{ status: "call_placed", call_id }`
* **Emails**

  * Input: `{ to, subject, body }`
  * Output: `{ success: true, email_id }`

---

## 5. Integrations

* \[Payment Provider]
* \[Telephony Provider]
* \[Calendar API]
* \[Email API]
* \[Other APIs]

---

## 6. Architecture

* **Frontend:** \[Framework/UI stack]
* **Backend:** \[API services/functions]
* **Database/Auth:** \[DB + Auth provider]
* **Edge Functions:** \[Webhook handlers, background jobs]
* **AI Layer:**

  * Input: `{ thread_context, user_message }`
  * Output: `{ intent, structured_command }`
* **Execution Layer:** Maps structured command → service call

---

## 7. Security

* RLS or ACLs for user data
* Encrypted tokens/secrets
* Webhook signature verification

---

## 8. Success Metrics

* **Activation Rate**

  ```sql
  select count(*) from users u
  where exists (select 1 from messages m where m.user_id = u.id);
  ```
* **Task Completion Rate**
* **Engagement (DAU/WAU)**
* **Retention**
* **Revenue (MRR, ARR)**

---

```