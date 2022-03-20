import EmbedUtil from "./EmbedUtil";
import type { EmbedDataStyle } from "../Typings/EmbedData";
import type { NormalizeField } from "../Typings/NormalizeField";

export default class RichEmbed {
    public type?: string;

    public title?: string;

    public description?: string;

    public url?: string;

    public color?: string | number;

    public timestamp?: any;

    public fields: Array<{ name: string, value: string }> | undefined;

    public thumbnail: {
        url?: string;
        proxyURL?: string;
        height?: number;
        width?: number;
    } | undefined;

    public image: {
        url?: string;
        proxyURL?: string;
        height?: number;
        width?: number;
    } | undefined;

    public author: {
        name?: string;
        url?: string;
        iconURL?: string;
        icon_url?: string
        proxyIconURL?: string;
    } | undefined;

    public provider: {
        name?: string;
        url?: string;
    } | undefined;

    public footer: {
        text?: string;
        iconURL?: string;
        proxyIconURL?: string;
    } | undefined;

    public constructor(data?: EmbedDataStyle, skipValidation = true) {
        this.setup(data, skipValidation);
    }

    public setup(data?: EmbedDataStyle, skipValidation?: boolean): void {
        this.type = data?.type ?? "rich";
        this.title = data?.title ?? undefined;
        this.description = data?.description ?? undefined;
        this.url = data?.url ?? undefined;
        this.color = "color" in data! ? EmbedUtil.resolveColor(data.color!) : undefined;
        this.timestamp = new Date(data!.timestamp).getTime();
        this.fields = [];
        if (data?.fields) {
            this.fields = skipValidation ? data?.fields.map(EmbedUtil.cloneObject)
            // @ts-ignore: NormalizeFields
            : this.constructor.normalizeFields(data.fields);
        }
        this.thumbnail = data?.thumbnail ? {
            url: data.thumbnail?.url ?? undefined,
            proxyURL: data.thumbnail?.proxyURL ?? data.thumbnail?.proxy_url ?? undefined,
            height: data.thumbnail?.height ?? undefined,
            width: data.thumbnail?.width ?? undefined,
        } : undefined;
        this.image = data?.image ? {
          url: data.image?.url ?? undefined,
          proxyURL: data.image?.proxyURL ?? data.image?.proxy_url ?? undefined,
          height: data.image?.height ?? undefined,
          width: data.image?.width ?? undefined,
        } : undefined;
        this.author = data?.author ? {
          name: data.author?.name ?? undefined,
          url: data.author?.url ?? undefined,
          iconURL: data.author?.iconURL ?? data.author?.icon_url ?? undefined,
          proxyIconURL: data.author?.proxyIconURL ?? data.author?.proxy_icon_url ?? undefined,
        } : undefined;
        this.provider = data?.provider ? {
          name: data.provider?.name ?? undefined,
          url: data.provider?.name ?? undefined,
        } : undefined;
        this.footer = data?.footer ? {
          text: data.footer?.text ?? undefined,
          iconURL: data.footer?.iconURL ?? data.footer?.icon_url ?? undefined,
          proxyIconURL: data.footer?.proxyIconURL ?? data.footer?.proxy_icon_url ?? undefined,
        } : undefined;
    }

    public get createdAt(): unknown {
        return this.timestamp ? new Date(this.timestamp) : null;
    }

    public get hexColor(): string | null {
        return this.color ? `#${this.color.toString(16).padStart(6, "0")}` : null;
    }

    public get length(): number {
        return (
            (this.title!.length || 0)
            + (this.description!.length || 0)
            + (this.fields!.length >= 1
              ? this.fields!.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0)
              : 0)
             + (this.footer!.text!.length || 0)
             + (this.author!.name!.length || 0)
          );
    }

    public addField(name: string, value?: unknown, inline?: boolean): this {
        return this.addFields({ name, value, inline });
    }

    public addFields(...fields: Array<{ name: string, value?: unknown, inline?: boolean }>): this {
        // @ts-ignore: NormalizeFields
        this.fields.push(...this.constructor.normalizeFields(fields));
        return this;
    }

    public setAuthor(name: any, iconURL: any, url: any): this {
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

    public setTimestamp(timestamp: unknown = Date.now()): this {
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

    public toJSON(): EmbedDataStyle {
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

    public static normalizeField(
        name: string,
        value: unknown,
        inline: boolean = false,
    ): NormalizeField {
        return {
          name: EmbedUtil.verifyString(name, RangeError, "EMBED_FIELD_NAME", false),
          value: EmbedUtil.verifyString(value, RangeError, "EMBED_FIELD_VALUE", false),
          inline,
        };
    }

    public static normalizeFields(...fields: any[]): any {
        return fields
        .flat(2)
        .map((field) => this.normalizeField(field.name, field.value, typeof field.inline === "boolean" ? field.inline : false));
    }
}
