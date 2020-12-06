import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { execAPI } from '../google'
import path from 'path'
import { readFile } from 'fs/promises'
const httpTrigger: AzureFunction = async function (
  context: Context,
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
    // context.res = {
    //   status: 503,
    //   body: { e, env: process.env, dirName: __dirname },
    // }
    const file = await readFile(
      path.join(__dirname, '../google/serviceAccountKey.json'),
    )
    context.res = { body: { message: 'server error', file } }
  }
}

export default httpTrigger
