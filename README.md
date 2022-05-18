## Overview
-------------

ElasticPath PCM data and Builder

## Prerequisites
-------------

You need to set up some accounts, install development tools, and ensure that you have some knowledge of the technologies that are used in the storefront.

### [](https://documentation.elasticpath.com/commerce-cloud/docs/developer/get-started/reference-storefront.html#accounts)Accounts

Before you begin, ensure that you have the following accounts set up:

-   [Elastic Path Commerce Cloud account](https://dashboard.elasticpath.com/login)
-   [Builder.io Account](https://builder.io)
-   [Stripe account](https://dashboard.stripe.com/) - Stripe is used as the payment gateway. From your Commerce Cloud Dashboard, configure Stripe as the payment gateway.
-   [Algolia account](https://www.algolia.com/) - Algolia may be used for search functionality to display search results, facets, and filtering.
-   [Coveo account](https://www.coveo.com/en/products/platform) - Coveo may be used for search functionality to display search results, facets, and filtering.
    -   [Installation, tutorials, core concepts, how-tos, etc.](https://docs.coveo.com/en/375/javascript-search-framework/use-the-coveo-javascript-search-framework)
    -   [Reference for components, classes, interfaces, top-level functions, etc.](https://coveo.github.io/search-ui/globals.html)

### [](https://documentation.elasticpath.com/commerce-cloud/docs/developer/get-started/reference-storefront.html#development-tools)Development tools

A React PWA Reference Storefront development environment requires the following software:

-   [Git](https://git-scm.com/downloads)
-   [Node.js](https://nodejs.org/en/download/)
-   [Yarn](https://yarnpkg.com/)
-   [Visual Studio Code](https://code.visualstudio.com/) with the following extensions:
    -   [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
    -   [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
-   Windows Only: [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/about)

### [](https://documentation.elasticpath.com/commerce-cloud/docs/developer/get-started/reference-storefront.html#knowledge-requirements)Knowledge requirements

To customize and extend the storefront, you need knowledge in the following technologies:

-   [React](https://reactjs.org/)
-   [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets)
-   [sass](https://sass-lang.com/)


### Getting started with Builder.io :
      - [1: Create an account for Builder.io](#1-create-an-account-for-builderio)
      - [2: Your Builder.io private key](#2-your-builderio-private-key)
      - [3: Clone this repository and initialize a Builder.io space](#3-clone-this-repository-and-initialize-a-builderio-space)

#### 1: Create an account for Builder.io

Before we start, head over to Builder.io and [create an account](https://builder.io/signup).

#### 2: Your Builder.io private key

Head over to your [organization settings page](https://builder.io/account/organization?root=true) and create a
private key, copy the key for the next step.

- Visit the [organization settings page](https://builder.io/account/organization?root=true), or select
  an organization from the list 

![organizations drop down list](./docs/images/builder-io-organizations.png)

- Click "Account" from the left hand sidebar
- Click the edit icon for the "Private keys" row
- Copy the value of the auto-generated key, or create a new one with a name that's meaningful to you


![Example of how to get your private key](./docs/images/private-key-flow.png)

#### 3: Clone this repository and initialize a Builder.io space

Next, we'll create a copy of the starter project, and create a new
[space](https://www.builder.io/c/docs/spaces) for it's content to live
in.

In the example below, replace `<private-key>` with the key you copied
in the previous step, and change `<space-name>` to something that's
meaningful to you -- don't worry, you can change it later!

Note:
if you're only interested in using this starter for a landing page use this command instead:

```
builder create --key "<private-key>" --name "<space-name>" --input builder-landing-page-only --debug
```


If this was a success you should be greeted with a message that
includes a public API key for your newly minted Builder.io space.

*Note: This command will also publish some starter builder.io cms
content from the ./builder directory to your new space when it's
created.*

``` bash
  ____            _   _       _                     _                    _   _ 
| __ )   _   _  (_) | |   __| |   ___   _ __      (_)   ___       ___  | | (_)
|  _ \  | | | | | | | |  / _` |  / _ \ | '__|     | |  / _ \     / __| | | | |
| |_) | | |_| | | | | | | (_| | |  __/ | |     _  | | | (_) |   | (__  | | | |
|____/   \__,_| |_| |_|  \__,_|  \___| |_|    (_) |_|  \___/     \___| |_| |_|

|████████████████████████████████████████| product-info-section writing schema.json | 1/1
|████████████████████████████████████████| announcment-bar: writing schema.json | 1/1
|████████████████████████████████████████| page: writing schema.json | 2/2


Your new space "Elasticpath starter" public API Key: 012345abcdef0123456789abcdef0123
```

Copy the public API key ("012345abcdef0123456789abcdef0123" in the example above) for the next step.

This starter project uses dotenv files to configure environment variables.
Open the files [.env.development](./.env.development) and
[.env.production](./.env.production) in your favorite text editor, and
set the value of `REACT_APP_BUILDER_PUBLIC_KEY` to the public key you just copied.
You can ignore the other variables for now, we'll set them later.

```diff
+ REACT_APP_BUILDER_PUBLIC_KEY=012345abcdef0123456789abcdef0123
- BUILDER_PUBLIC_KEY=
```


### [](https://documentation.elasticpath.com/commerce-cloud/docs/developer/get-started/reference-storefront.html#push-the-product-catalog-to-algolia)Push the product catalog to Algolia

To enable product search, share your product catalog with Algolia. Elastic Path offers a script that you can use to push the catalog from Elastic Path Commerce Cloud to Algolia.

1.  Go to the [catalog syndication open source project](https://github.com/elasticpath/catalog-syndication).
2.  Follow the instructions in the [README file](https://github.com/elasticpath/catalog-syndication/blob/master/README.md#start-running-the-utilities).

[](https://documentation.elasticpath.com/commerce-cloud/docs/developer/get-started/reference-storefront.html#start-building-the-storefront)Start building the storefront
------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#####  NOTE

If you are running a Windows environment, launch the Windows Subsystem for Linux application and perform the following steps from the console window.

```
# Clone the Git repository
git clone https://github.com/elasticpath/epcc-react-pwa-reference-storefront.git

# Go into the cloned directory
cd epcc-react-pwa-reference-storefront

# Install all the dependencies for all sub-project and create necessary symlinks in-between them
yarn

# Configure the ./src/config.ts file.
# For more information, see Configuration parameter descriptions.

# Start the app in development mode

# Run the main application:
yarn start

# Builds the app for production to the build folder:
yarn build

```

[](https://documentation.elasticpath.com/commerce-cloud/docs/developer/get-started/reference-storefront.html#configuration-parameter-descriptions)Configuration parameter descriptions
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Parameters that require configuration are in the `./src/config.ts` file. You must set these values based on your own store:

| Parameter | Importance | Type | Description |
| --- | --- | --- | --- |
| `clientId` | Required | String | The client ID of your store. |
| `stripeKey` | Required | String | Stripe publishable API key. |
| `categoryPageSize` | Required | String | Maximum number of products to display on a category page. |
| `maxCompareProducts` | Required | String | Maximum number of products to display in compare view. |
| `algoliaAppId` | Required | String | Algolia application identifier. |
| `algoliaApiKey` | Required | String | Algolia API key used to read records. |
| `algoliaPlacesAppId` | Required | String | Algolia Places application identifier used for address lookup. |
| `algoliaPlacesApiKey` | Required | String | Algolia Places API key used for address lookup. |
| `algoliaIndexName` | Required | String | Name of Algolia index used for search functions. |
| `compareKeys` | Required | Array | An array of all product attributes to display in compare view. For example, `config.ts`: `'bulb','bulb';'max_watt','wattage';'bulb_qty','bulb-qty';'material','material';'finish','finish'` |
| `endpointURL` | Default | String | Optional override location of API endpoint. |
| `supportedLocales` | Default | Object | Key-value pair of supported languages for storefront. An example is, `config.ts`: `[{"key": "en","name": "english"},{"key": "fr","name": "french"}]`. |
| `defaultLanguage` | Default | String | Default language to display in storefront upon loading the page. For example. `"en"` |
| `defaultCurrency` | Default | String | Default currency to display in storefront upon loading the page. Fro example, `"USD"` |
