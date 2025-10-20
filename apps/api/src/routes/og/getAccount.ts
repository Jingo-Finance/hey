import {
  BRAND_COLOR,
  STATIC_IMAGES_URL,
  TRANSFORMS
} from "@hey/data/constants";
import escapeHtml from "@hey/helpers/escapeHtml";
import { default as getAccountData } from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import normalizeDescription from "@hey/helpers/normalizeDescription";
import { AccountDocument, type AccountFragment } from "@hey/indexer";
import type { Context } from "hono";
import { html } from "hono/html";
import generateOg from "./ogUtils";

const getAccount = async (ctx: Context) => {
  const { username } = ctx.req.param();

  return generateOg({
    buildHtml: (account: AccountFragment) => {
      const { name, link } = getAccountData(account);
      const title = `${name} (${username}) on Hey`;
      const description = normalizeDescription(account?.metadata?.bio, title);
      const avatar = getAvatar(account, TRANSFORMS.AVATAR_BIG);

      const escTitle = escapeHtml(title);
      const escDescription = escapeHtml(description);
      const escName = escapeHtml(name);
      const escUsername = escapeHtml(username);

      return html`
        <html>
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="content-language" content="en-US" />
            <meta name="theme-color" content="${BRAND_COLOR}" />
            <title>${escTitle}</title>
            <meta name="description" content="${escDescription}" />
            <meta property="og:title" content="${escTitle}" />
            <meta property="og:description" content="${escDescription}" />
            <meta property="og:type" content="profile" />
            <meta property="og:site_name" content="Hey" />
            <meta property="og:url" content="https://hey.xyz${link}" />
            <meta property="og:image" content="${avatar}" />
            <meta property="og:logo" content="${STATIC_IMAGES_URL}/app-icon/0.png" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="${escTitle}" />
            <meta name="twitter:description" content="${escDescription}" />
            <meta name="twitter:image" content="${avatar}" />
            <meta name="twitter:site" content="@heydotxyz" />
            <link rel="icon" href="https://hey.xyz/favicon.ico" />
            <link rel="canonical" href="https://hey.xyz${link}" />
          </head>
          <body>
            <img src="${avatar}" alt="${escName}" height="100" width="100" />
            <h1>${escName || username}</h1>
            <h2>${escUsername}</h2>
            <h3>${escDescription}</h3>
          </body>
        </html>
      `;
    },
    ctx,
    extractData: (data) => data.account,
    query: AccountDocument,
    variables: { request: { username: { localName: username } } }
  });
};

export default getAccount;
