export interface EmbedDataStyle {
    type?: string,
    title?: string,
    description?: string,
    url?: string,
    color: string | number,
    timestamp: number | Date,
    fields?: Array<{ name: string, value: string }>,
    thumbnail?: {
        url?: string,
        proxyURL?: string,
        proxy_url?: string,
        height?: number,
        width?: number,
    },
    image?: {
        url?: string,
        iconURL?: string,
        icon_url?: string,
        proxyURL?: string,
        proxy_url?: string,
        width?: number,
        height?: number,
    }
    author?: {
        name?: string,
        url?: string,
        iconURL?: string,
        icon_url?: string,
        proxyIconURL?: string,
        proxy_icon_url?: string,
    },
    provider?: {
        name?: string,
        url?: string,
    },
    footer?: {
        text?: string,
        iconURL?: string,
        icon_url?: string,
        proxyIconURL?: string,
        proxy_icon_url?: string,
    },
}
