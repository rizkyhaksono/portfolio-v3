/** API origin for server code: the in-cluster address when deployed, the public one elsewhere. */
export const serverApiUrl = (): string | undefined => process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
