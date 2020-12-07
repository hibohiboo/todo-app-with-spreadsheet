import path from 'path'
import { google } from 'googleapis'
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const sheets = google.sheets('v4')

export async function execAPI(spreadsheetId, range) {
  const auth = await google.auth.getClient({
    credentials: {
      client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
      private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
    },
    scopes: SCOPES,
  })

  const apiOptions = {
    auth,
    spreadsheetId,
    range,
  }
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(apiOptions, (err, res) => {
      if (err) {
        reject(err)
        return
      }
      console.log(res.data.values)
      resolve(res.data.values)
    })
  })
}
