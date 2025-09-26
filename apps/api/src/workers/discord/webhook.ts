import type {
  CollectQueueItem,
  DiscordQueueItem,
  LikeQueueItem,
  PostQueueItem
} from "../../utils/discordQueue";

export type WebhookDetails = { webhookUrl?: string; body: unknown };

const postContent = (payload: PostQueueItem["payload"]) => {
  const postUrl = payload.slug ? `https://hey.xyz/posts/${payload.slug}` : "";
  const type = payload.type ?? "post";
  return { content: `New ${type} on Hey ${postUrl}`.trim() };
};

const likeContent = (payload: LikeQueueItem["payload"]) => {
  const postUrl = payload.slug ? `https://hey.xyz/posts/${payload.slug}` : "";
  return { content: `New like on Hey ${postUrl}`.trim() };
};

const collectContent = (payload: CollectQueueItem["payload"]) => {
  const postUrl = payload.slug ? `https://hey.xyz/posts/${payload.slug}` : "";
  return { content: `New collect on Hey ${postUrl}`.trim() };
};

export const resolveWebhook = (item: DiscordQueueItem): WebhookDetails => {
  if (item.kind === "post") {
    return {
      body: postContent(item.payload),
      webhookUrl: process.env.EVENTS_DISCORD_WEBHOOK_URL
    };
  }
  if (item.kind === "collect") {
    return {
      body: collectContent((item as CollectQueueItem).payload),
      webhookUrl: process.env.COLLECTS_DISCORD_WEBHOOK_URL
    };
  }
  if (item.kind === "like") {
    return {
      body: likeContent((item as any).payload),
      webhookUrl: process.env.LIKES_DISCORD_WEBHOOK_URL
    };
  }
  return { body: {}, webhookUrl: undefined };
};
