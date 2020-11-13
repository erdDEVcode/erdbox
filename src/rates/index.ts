import { Api } from 'erdor'
import qs from 'querystring'

import { _ } from '../utils'
import { Rates } from '../types/all'
import Data from '../data'

class RateApi extends Api {
  _tokenIds: string[]
  _rateApiNames: string[]

  constructor() {
    super('https://api.coingecko.com/api/v3')

    const asArray = Object.values(Data.getTokens())
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
    const { rateApiName: currencyId } = Data.getCurrency(currency)

    const qry = qs.stringify({
      ids: this._rateApiNames.join(','),
      vs_currencies: currencyId!,
    })

    const data = await this._call(`/simple/price?${qry}`)

    return this._tokenIds.reduce((m, id) => {
      let value = parseFloat(_.get(data, `${Data.getToken(id).rateApiName}.${currencyId}`))

      if (Data.getToken(id).rateMultiplier) {
        value *= Data.getToken(id).rateMultiplier!
      }

      (m as Rates)[id] = {
        token: id,
        currency,
        value,
      }
      return m
    }, {})
  }
}

export const rateApi = new RateApi()