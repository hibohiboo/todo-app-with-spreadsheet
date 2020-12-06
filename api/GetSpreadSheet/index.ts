import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { execAPI } from '../google'
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  try {
    const list = await execAPI(
      process.env.SPREAD_SHEET_ID,
      process.env.SPREAD_SHEET_RANGE,
    )

    context.res = {
      body: list,
    }
  } catch (e) {
    context.res = {
      status: 503,
      body: { e, env: process.env, dirName: __dirname },
    }
  }
}

export default httpTrigger
