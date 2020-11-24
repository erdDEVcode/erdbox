import { Api } from 'elrondjs'
import { data } from 'elrond-data'
import qs from 'querystring'

import { _ } from '../utils'
import { Rates } from '../types/all'

class RateApi extends Api {
  _tokenIds: string[]
  _rateApiNames: string[]

  constructor() {
    super('https://api.coingecko.com/api/v3')

    const asArray = Object.values(data.getTokens())
    this._tokenIds = asArray.map(({ id }) => id)
    this._rateApiNames = asArray.reduce((m, { rateApiName }) => {
      if (rateApiName) {
        return m.concat(rateApiName)
      } else {
        return m
      }
    }, ([] as string[]))
  }

  async getRates(currency: string): Promise<Rates> {
    const { rateApiName: currencyId } = data.getToken(currency)

    const qry = qs.stringify({
      ids: this._rateApiNames.join(','),
      vs_currencies: currencyId!,
    })

    const calldata = await this._call(`/simple/price?${qry}`)

    return this._tokenIds.reduce((m, id) => {
      const value = parseFloat(_.get(calldata, `${data.getToken(id).rateApiName}.${currencyId}`))

      ;(m as Rates)[id] = {
        token: id,
        currency,
        value: `${value}`,
      }
      return m
    }, {})
  }
}

export const rateApi = new RateApi()