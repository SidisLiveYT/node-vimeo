import { Readable } from 'stream'

type scrapperOptions = {
  htmlOptions: object
  fetchOptions: { fetchStreamReadable: boolean | 'true' }
  ignoreError: boolean | 'true'
  parseRaw: boolean | 'true'
}
declare class vimeoTrack {
  public get videoId(): string | void
  public get raw(): object | void
  public get extraRaw(): object | void
  public get rawJSON(): object | void
  public parseRaw(rawObjects: object | void): object | void
  public getStream(fetchUrl: string | void): Promise<Readable>
}

declare class vimeo {
  public static readonly __scrapperOptions: scrapperOptions
  public static readonly __vimeoRegex: RegExp[]
  public static readonly __vimeoPlayerRegex: RegExp[]
  public static readonly __playerUrl: string
  public static html(
    rawUrl: string,
    __scrapperOptions: scrapperOptions,
  ): Promise<vimeoTrack>
  public static __test(
    rawUrl: string,
    returnRegex: boolean | 'false',
  ): boolean | RegExpMatchArray
}
export default vimeo
export function html(
  rawUrl: string,
  __scrapperOptions: scrapperOptions,
): Promise<vimeoTrack>
