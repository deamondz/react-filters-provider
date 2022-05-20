import qs from 'qs';


export function encodeSearchParams(
    searchParams: Record<string, unknown>,
    options: Record<string, unknown> = {},
): string {
    return qs.stringify(searchParams, {
        skipNulls: true,
        addQueryPrefix: true,
        arrayFormat: 'repeat',
        ...options,
    });
}

export function decodeSearchParams(searchParamsStr: string): Record<string, unknown> {
    return qs.parse(searchParamsStr, {
        ignoreQueryPrefix: true,
        decoder(value) {
            if (/^(\d+|\d*\.\d+)$/.test(value)) {
                return parseFloat(value);
            }

            const keywords: Record<string, null | undefined | boolean> = {
                true: true,
                false: false,
                null: null,
                undefined: undefined,
            };
            if (value in keywords) {
                return keywords[value];
            }

            return decodeURIComponent(value);
        },
    });
}