import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { execAPI } from '../google'
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const list = await execAPI(
    process.env.SPREAD_SHEET_ID,
    process.env.SPREAD_SHEET_RANGE,
  )

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: list,
  }
}

export default httpTrigger
