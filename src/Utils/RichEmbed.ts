import EmbedUtil from "./EmbedUtil";
import type { EmbedDataStyle } from "../Typings/EmbedData";
import type { NormalizeField } from "../Typings/NormalizeField";

export default class RichEmbed {
    public type?: string;

    public title?: string | null;

    public description?: string | null;

    public url?: string | null;

    public color?: string | number | null;

    public timestamp?: number | Date | null;

    public fields?: Array<{ name: string, value: string }> | null;

    public thumbnail?: {
        url?: string;
        proxyURL?: string;
        height?: number;
        width?: number;
    } | null;

    public image?: {
        url?: string;
        proxyURL?: string;
        height?: number;
        width?: number;
    } | null;

    public author?: {
        name?: string;
        url?: string;
        iconURL?: string;
        proxyIconURL?: string;
    } | null;

    public provider?: {
        name?: string;
        url?: string;
    } | null;

    public footer?: {
        text?: string;
        iconURL?: string;
        proxyIconURL?: string;
    } | null;

    public constructor(data = {}, skipValidation = true) {
        // @ts-ignore: Data contains empty object
        this.setup(data, skipValidation);
    }

    public setup(data: EmbedDataStyle, skipValidation?: boolean): void {
        this.type = data?.type ?? "rich";
        this.title = data?.title ?? null;
        this.description = data?.description ?? null;
        this.url = data?.url ?? null;
        this.color = "color" in data ? EmbedUtil.resolveColor(data.color) : null;
        this.timestamp = "timestamp" in data ? new Date(data.timestamp).getTime() : null;
        this.fields = [];
        if (data.fields) {
            this.fields = skipValidation ? data.fields.map(EmbedUtil.cloneObject)
            // @ts-ignore: NormalizeFields
            : this.constructor.normalizeFields(data.fields);
        }
        this.thumbnail = data?.thumbnail ? {
            url: data.thumbnail.url,
            proxyURL: data.thumbnail.proxyURL || data.thumbnail.proxy_url,
            height: data.thumbnail.height,
            width: data.thumbnail.width,
        } : null;
        this.image = data?.image ? {
          url: data.image.url,
          proxyURL: data.image?.proxyURL ?? data.image?.proxy_url,
          height: data.image.height,
          width: data.image.width,
        } : null;
        this.author = data?.author ? {
          name: data.author.name,
          url: data.author.url,
          iconURL: data.author?.iconURL ?? data.author?.icon_url,
          proxyIconURL: data.author?.proxyIconURL ?? data.author.proxy_icon_url,
        } : null;
        this.provider = data?.provider ? {
          name: data.provider.name,
          url: data.provider.name,
        } : null;
        this.footer = data?.footer ? {
          text: data.footer.text,
          iconURL: data.footer.iconURL || data.footer.icon_url,
          proxyIconURL: data.footer.proxyIconURL || data.footer.proxy_icon_url,
        } : null;
    }

    public get createdAt(): Date | null {
        return this.timestamp ? new Date(this.timestamp) : null;
    }

    public get hexColor(): string | null {
        return this.color ? `#${this.color.toString(16).padStart(6, "0")}` : null;
    }

    public get length(): number {
        return (
            (this.title?.length || 0)
            + (this.description?.length || 0)
            + (this.fields?.length ?? 0 >= 1
              ? this.fields!.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0)
              : 0)
             + (this.footer?.text?.length ?? 0)
             + (this.author?.name?.length ?? 0)
          );
    }

    public addField(name: string, value?: unknown, inline?: boolean): this {
        return this.addFields({ name, value, inline });
    }

    public addFields(...fields: Array<{ name?: string, value?: unknown, inline?: boolean }>): this {
        // @ts-ignore: NormalizeFields
        this.fields!.push(...this.constructor.normalizeFields(fields));
        return this;
    }

    public setAuthor(name: string, iconURL: string, url: string): this {
        this.author = { name: EmbedUtil.verifyString(name, RangeError, "EMBED_AUTHOR_NAME"), iconURL, url };
        return this;
    }

    public setColor(color: string | number): this {
        this.color = EmbedUtil.resolveColor(color);
        return this;
    }

    public setDescription(description: string): this {
        this.description = EmbedUtil.verifyString(description, RangeError, "EMBED_DESCRIPTION");
        return this;
    }

    public setFooter(text: string, iconURL?: string): this {
        this.footer = { text: EmbedUtil.verifyString(text, RangeError, "EMBED_FOOTER_TEXT"), iconURL };
        return this;
    }

    public setImage(url: string): this {
        this.image = { url };
        return this;
    }

    public setThumbnail(url: string): this {
        this.thumbnail = { url };
        return this;
    }

    public setTimestamp(timestamp = Date.now() as number | Date): this {
        // eslint-disable-next-line no-param-reassign
        if (timestamp instanceof Date) timestamp = timestamp.getTime();
        this.timestamp = timestamp;
        return this;
    }

    public setTitle(title: string): this {
        this.title = EmbedUtil.verifyString(title, RangeError, "EMBED_TITLE");
        return this;
    }

    public setURL(url: string): this {
        this.url = url;
        return this;
    }

    public toJSON(): unknown {
        return {
          title: this.title,
          type: "rich",
          description: this.description,
          url: this.url,
          timestamp: this.timestamp && new Date(this.timestamp),
          color: this.color,
          fields: this.fields,
          thumbnail: this.thumbnail,
          image: this.image,
          author: this.author && {
            name: this.author.name,
            url: this.author.url,
            icon_url: this.author.iconURL,
          },
          footer: this.footer && {
            text: this.footer.text,
            icon_url: this.footer.iconURL,
          },
        };
    }

    public static normalizeField(name: string, value: unknown, inline = false): NormalizeField {
        return {
          name: EmbedUtil.verifyString(name, RangeError, "EMBED_FIELD_NAME", false),
          value: EmbedUtil.verifyString(value, RangeError, "EMBED_FIELD_VALUE", false),
          inline,
        };
    }

    public static normalizeFields(
        ...fields: Array<{ name: string, value: unknown, inline: boolean }>
    ): unknown {
        return fields
        .flat(2)
        .map((field) => this.normalizeField(field.name, field.value, typeof field.inline === "boolean" ? field.inline : false));
    }
}
