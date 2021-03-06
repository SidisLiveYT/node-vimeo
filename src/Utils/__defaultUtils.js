const Axios = require('axios').default
const fileSystem = require('fs')
const path = require('path')

class utils {
  /**
   * @static __rawfetchBody() -> Fetch raw Body/Source Code of API Page in form of data or method based return response
   * @param {string} rawApiUrl API Url or Normal HTML Page Url to be Fetched using Axios or Posted
   * @param {object} htmlOptions api or html Options for Axios
   * @param {string | void | 'data'} returnType Return Type/Key from Response
   * @param {boolean | 'true'} ignoreError Error should be ignored ?
   * @param {string | 'GET'} axiosMethod Axios method
   * @param {object | void | string[] | object[]} filters Extra Options or Future based Data to be given
   * @returns
   */
  static async __rawfetchBody(
    rawApiUrl,
    htmlOptions = {},
    returnType = 'data',
    ignoreError = true,
    axiosMethod = 'GET',
    filters,
  ) {
    if (!(rawApiUrl && typeof rawApiUrl === 'string' && rawApiUrl !== ''))
      return undefined
    try {
      let rawResponse
      if (axiosMethod?.toLowerCase()?.trim() === 'get')
        rawResponse = await Axios.get(rawApiUrl, { ...htmlOptions })
      else if (axiosMethod?.toLowerCase()?.trim() === 'post')
        rawResponse = await Axios.post(rawApiUrl, { ...htmlOptions })
      if (
        !(
          rawResponse &&
          rawResponse.status === 200 &&
          rawResponse?.[returnType ?? 'data']
        )
      )
        throw new Error('Invalid Response Fetched from Api Url')
      else if (returnType === 'all') return rawResponse
      else return rawResponse?.[returnType ?? 'data']
    } catch (rawError) {
      if (ignoreError) return utils.__errorHandling(rawError)
      else throw rawError
    }
  }

  static __cacheTemp(
    rawData,
    fileName = `caches-${
      parseInt(Math.floor(Math.random() * 100))
    }-i.html`,
  ) {
    if (!fileSystem.existsSync(path.join(__dirname, '/../cache')))
      fileSystem.mkdirSync(path.join(__dirname, '/../cache'))
    const __cacheLocation = path.join(__dirname, '/../cache', `/${fileName}`)
    if (!__cacheLocation) return undefined
    return fileSystem.writeFileSync(__cacheLocation, rawData)
  }

  static __errorHandling(error = new Error()) {
    if (!error?.message) return undefined
    if (!fileSystem.existsSync(path.join(__dirname, '/../cache')))
      fileSystem.mkdirSync(path.join(__dirname, '/../cache'))
    const __cacheLocation = path.join(
      __dirname,
      '/../cache',
      '/__errorLogs.txt',
    )
    if (!__cacheLocation) return undefined
    if (!fileSystem.existsSync(__cacheLocation)) {
      fileSystem.writeFileSync(
        __cacheLocation,
        `${new Date()} | ` +
          `\n ErrorMessage: ${error?.message ?? `${error}`}\n ErrorStack: ${
            error?.stack ?? 'Unknown-Stack'
          }`,
      )
    } else if (
      (fileSystem.readFileSync(__cacheLocation)?.length ?? 0) < 500000
    ) {
      fileSystem.appendFileSync(
        __cacheLocation,
        `${(fileSystem.readFileSync(__cacheLocation)?.length ?? 0) > 100
          ? '\n\n'
          : ''
        }${new Date()} | ` +
          `\n ErrorMessage: ${error?.message ?? `${error}`}\n ErrorStack: ${
            error?.stack ?? 'Unknown-Stack'
          }`,
        'utf8',
      )
    } else {
      fileSystem.writeFileSync(
        __cacheLocation,
        `${new Date()} | ` +
          `\n ErrorMessage: ${error?.message ?? `${error}`}\n ErrorStack: ${
            error?.stack ?? 'Unknown-Stack'
          }`,
      )
    }
    return true
  }

  /**
   * @static __vimeoVideoIdParser() -> parsing Vimeo Supported URls to fetch Video Id
   * @param {string} rawUrl raw Vimeo Video Url to be parsed
   * @param {RegExp[]} videoRegex Array of Regex for matching and parsing
   * @returns {number} Returns Video Id in number using parseInt
   */
  static __vimeoVideoIdParser(
    rawUrl,
    videoRegex = [
      /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/,
      /(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/?(showcase\/)*([0-9))([a-z]*\/)*([0-9]{6,11})[?]?.*/,
      /(?:http:|https:|)\/\/(?:player.|www.)?vimeo\.com\/(?:video\/|embed\/|watch\?\S*v=|v\/)?(\d*)/g,
      /((http|https)?:\/\/(?:[\w\-\_]+\.))+(player+\.)vimeo\.com/g,
    ],
  ) {
    try {
      if (
        rawUrl &&
        ['string', 'number'].includes(typeof rawUrl) &&
        rawUrl !== '' &&
        videoRegex &&
        Array.isArray(videoRegex) &&
        videoRegex?.length > 0
      ) {
        const desiredRegex = videoRegex?.find((rawRegex) => rawUrl?.match(rawRegex)?.pop())
        const rawVideoId = rawUrl?.match(desiredRegex)?.pop()
        if (!(rawVideoId && !Number.isNaN(rawVideoId))) return undefined
        else return parseInt(rawVideoId)
      } else return undefined
    } catch {
      return undefined
    }
  }
}

module.exports = utils
