# heroku-stripe-checkout

A self-hosted service for accepting payments with [Stripe Checkout](https://stripe.com/docs/checkout).

## Usage

### 1. Click "Deploy to Heroku" and enter your configuration details.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/christophercliff/heroku-stripe-checkout)

### 2. Publish `catalog.json`

The service fetches detailed product information from a public JSON document before creating a charge. This approach allows you to maintain a dynamic product catalog and prevents users from creating illegitimate charges.

```json
{
  "12345": {
    "amount": 1000,
    "currency": "usd",
    "metadata": {
      "description": "Your first product"
    }
  }
}
```

#### Options

- **`amount`** `Number`

    The amount in cents. *Required*.

- **`currency`** `String`

    The currency. Will override the setting on the server. Default `undefined`.

- **`description`** `String`

    The description. Default `undefined`.

- **`metadata`** `Object`

    Metadata to be included with the charge. Default `undefined`.

### 3. Insert the Stripe Checkout markup on your site

Using Stripe's [integration](https://stripe.com/docs/checkout#integration-simple) example. The form's `action` attribute should match the app you created in step 1.

```html
<form action="https://YOUR-APP.herokuapp.com/" method="POST">
    <script
        src="https://checkout.stripe.com/checkout.js"
        class="stripe-button"
        data-key="YOUR_PUBLISHABLE_KEY"
        data-amount="YOUR_AMOUNT"
    ></script>
    <input name="product_id" value="YOUR_PRODUCT_ID" type="hidden">
</form>
```

#### Additional `input` Fields

Use `input` fields to send information about the charge to the server.

- **`product_id`** `String`

    A unique ID. Must match a valid key in `catalog.json`. *Required*.

## Contributing

See [CONTRIBUTING](https://github.com/christophercliff/heroku-stripe-checkout/blob/master/CONTRIBUTING.md).

## License

See [LICENSE](https://github.com/christophercliff/heroku-stripe-checkout/blob/master/LICENSE.md).
