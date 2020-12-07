import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { execAPI } from '../google'
import path from 'path'
import { readFile } from 'fs/promises'
const httpTrigger: AzureFunction = async function (
  context: any,
  req: HttpRequest,
): Promise<void> {
  try {
    const list = await execAPI(
      process.env.APPSETTING_SPREAD_SHEET_ID,
      process.env.APPSETTING_SPREAD_SHEET_RANGE,
    )

    context.res = {
      body: list,
    }
  } catch (e) {
    context.console.error(e)
    context.res = {
      status: 500,
      body: { message: 'server error' },
    }
  }
}

export default httpTrigger
