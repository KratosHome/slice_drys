# Slice Drys

# Node.js 24 LTS

Use Node.js 24 locally and on Vercel. If you use nvm, run `nvm install` and
`nvm use` in the project directory; `.nvmrc` selects the supported major version.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 1. Install dependencies:

```bash
bun
```

//
If you have an error during installation use the command:

```bash
bun install
```

## 2. Create MongoDB database:

The project uses a `MongoDB` database. Go to the site [MongoDB](https://www.mongodb.com) create a project and cluster then add a link to your database to the `.env` file.

## 3. Create Cloudinary account:

The project uses the `Cloudinary` platform to work with images. Go to the site [Cloudinary](https://cloudinary.com/home), register and add your keys and cloud name to the `.env` file.

## 4. Run the development server:

```bash
bun run dev
```

## 5. Build and run project:

```bash
bun run build
```

and

```bash
bun run start
```

### Inspect bundle sizes

Run `bun run analyze` to create a production build and interactive bundle reports
in `.next/analyze/` (`client.html`, `nodejs.html`, and `edge.html`). The reports do
not open automatically. Use the client report's entrypoint filter to inspect the
homepage separately from admin and other routes.

### Additionally:

Check the `.env.example` file, your `.env` file should have the same variables but filled with your data.

The site's `admin panel` is located at [http://localhost:3000/en/admin](http://localhost:3000/en/admin).

### Accepted orders and GA4

An order counts as a GA4 `purchase` when MongoDB accepts the checkout, for both
cash and card orders. Its value is the accepted order total in UAH. Payment
settlement and later changes to the order status are separate from this metric.
The order number in the receipt is the GA4 `transaction_id`.

In production, set `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` to the GA4 web stream's
measurement ID and `GA4_API_SECRET` to a Measurement Protocol secret for that
same stream. Set `CRON_SECRET` to a random secret of at least 16 characters
and redeploy with Vercel Cron Jobs enabled. Only the measurement ID is public.
The MongoDB application account needs permission to create indexes on
`orders`. Checkout waits for the unique index on `idempotencyKey` before
accepting writes. This index excludes historical orders without a key.

The server saves the pending event with the order and attempts delivery after
checkout. The daily Vercel job scheduled for 03:00 UTC processes outstanding
events, including after a server restart. A scheduler on another host can call
`GET /api/cron/purchases` with `Authorization: Bearer <CRON_SECRET>`.
The endpoint can also be run again to drain a backlog. Check its HTTP status
and the ages of orders with `purchaseDelivery.state` equal to `pending` when
investigating missing purchases. Older orders without a pending event are
excluded from delivery.

Delivery retries use the same client ID and order number. The server uses the
numeric client ID from the GA cookie when available and otherwise generates a
random ID for the order. The payload contains receipt items, currency and total.
Customer contact details, address and comments are excluded.

A `received` state records an HTTP acknowledgment from the GA4 collector. To
verify reporting, check that transaction ID in the target GA4 property.
Retries carry the original acceptance time. After a delay longer than 72 hours,
GA4 can adjust the reported event time. See the
[GA4 event timestamp rules](https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events),
the [Measurement Protocol reference](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference)
and [GA4 transaction ID deduplication](https://support.google.com/analytics/answer/12313109).

### Storefront event acceptance

After deployment, use a dedicated test visit and inspect each browser event
and its parameters in the target property's [DebugView](https://support.google.com/analytics/answer/7201382).
A browser queue entry only establishes that the application queued the event.

| Action | Expected event and check |
| --- | --- |
| Scroll through the catalog, homepage slider and product-page recommendations | `view_item_list` for each card at least half visible in the foreground. Scroll back and verify the same card and variant are counted once per visit. |
| Select a card and open its product | `select_item` matches the impression's item, weight, list ID and position. The product page queues `view_item`. The two sliders use `popular_products` and `recommended_products`. |
| Add a pack, open the cart, then reduce its quantity | `add_to_cart`, `view_cart` and `remove_from_cart` reflect the selected variant and quantity change. |
| Open checkout and complete the shipping and payment steps | `begin_checkout`, `add_shipping_info` and `add_payment_info` appear at their respective steps. A failed placement queues `checkout_error` with an `error_code`. |
| Submit a callback or wholesale request using test destinations | `generate_lead` appears once after confirmed success with `form_type` equal to `callback` or `wholesale`. Opening a form, double clicking or receiving an error must not add another lead. |
| Click a store phone or email link, then sign up for the newsletter with a test address | `contact_click` contains only the contact method. A newly confirmed subscription queues `newsletter_signup`. Submitting an existing address adds no signup. |
| Inspect a fresh accepted test order in the designated test stream | Match the receipt number to `purchase.transaction_id` and compare UAH value, item IDs, weights, unit prices and quantities. |
| Drop the response after saving a test order, edit the comment or quantity, then reload | Select **Retry original order**. Verify one saved order, its original receipt, and a separate cart draft containing the edits. Reloading alone must not submit anything. |

The order status `awaitingReturn` records a workflow step. The storefront has
no confirmed money-return operation that could emit a `refund`.
